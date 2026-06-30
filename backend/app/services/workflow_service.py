import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

logger = logging.getLogger(__name__)


class WorkflowEngine:
    async def run_workflow(
        self,
        workflow_id: int,
        definition: Dict[str, Any],
        context: Optional[Dict[str, Any]] = None,
        db: Optional[AsyncSession] = None,
    ) -> Dict[str, Any]:
        run_id = str(uuid.uuid4())
        started_at = datetime.now(timezone.utc)
        results = []
        current_context = context or {}

        logger.info(f"Starting workflow {workflow_id}, run {run_id}")

        nodes = definition.get("nodes", [])
        edges = definition.get("edges", [])

        execution_order = self._topological_sort(nodes, edges)

        success = True
        for node_id in execution_order:
            node = next((n for n in nodes if n["id"] == node_id), None)
            if not node:
                continue
            try:
                node_result = await self._execute_node(node, current_context)
                current_context[node_id] = node_result
                results.append({"node_id": node_id, "status": "success", "output": node_result})
            except Exception as e:
                logger.error(f"Node {node_id} failed: {e}")
                results.append({"node_id": node_id, "status": "failed", "error": str(e)})
                success = False
                break

        return {
            "run_id": run_id,
            "workflow_id": workflow_id,
            "status": "completed" if success else "failed",
            "started_at": started_at.isoformat(),
            "completed_at": datetime.now(timezone.utc).isoformat(),
            "results": results,
        }

    def _topological_sort(self, nodes: List[Dict], edges: List[Dict]) -> List[str]:
        node_ids = [n["id"] for n in nodes]
        in_degree = {nid: 0 for nid in node_ids}
        adjacency = {nid: [] for nid in node_ids}

        for edge in edges:
            source = edge.get("source")
            target = edge.get("target")
            if source in adjacency and target in in_degree:
                adjacency[source].append(target)
                in_degree[target] += 1

        queue = [nid for nid in node_ids if in_degree[nid] == 0]
        result = []
        while queue:
            node = queue.pop(0)
            result.append(node)
            for neighbor in adjacency[node]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

        return result

    async def _execute_node(self, node: Dict[str, Any], context: Dict[str, Any]) -> Any:
        node_type = node.get("type", "action")
        config = node.get("config", {})

        if node_type == "trigger":
            return {"triggered": True, "data": config}
        elif node_type == "condition":
            condition = config.get("condition", "true")
            return {"result": True, "condition": condition}
        elif node_type == "action":
            action = config.get("action", "")
            logger.info(f"Executing action: {action}")
            return {"action": action, "executed": True}
        elif node_type == "notification":
            channel = config.get("channel", "email")
            return {"notification_sent": True, "channel": channel}
        elif node_type == "delay":
            duration = config.get("duration_minutes", 0)
            return {"delayed": True, "duration_minutes": duration}
        else:
            return {"node_type": node_type, "executed": True}


workflow_engine = WorkflowEngine()
