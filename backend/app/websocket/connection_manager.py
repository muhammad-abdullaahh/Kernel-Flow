from typing import Dict
from app.core.simulator import Simulator

# In-memory store for active simulations
# In a production app, this might be Redis or a database
active_simulations: Dict[str, Simulator] = {}
