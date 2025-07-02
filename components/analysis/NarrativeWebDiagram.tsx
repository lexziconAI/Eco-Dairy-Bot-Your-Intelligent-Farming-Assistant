import React, { useEffect, useRef, useState } from 'react';
import { NarrativeEvolutionMatrix } from '@/utils/conversation/MatrixComparison';

interface NarrativeNode {
  id: string;
  type: 'living' | 'ante' | 'grand';
  content: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

interface NarrativeWebDiagramProps {
  narratives: Array<{
    timestamp: number;
    narrative: NarrativeEvolutionMatrix;
    content?: string;
  }>;
  title?: string;
}

export default function NarrativeWebDiagram({ 
  narratives, 
  title = "Narrative Web - Story Evolution" 
}: NarrativeWebDiagramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<NarrativeNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<NarrativeNode | null>(null);
  const animationRef = useRef<number>();

  // Initialize nodes from narrative data
  useEffect(() => {
    if (narratives.length === 0) return;

    const newNodes: NarrativeNode[] = narratives.map((item, index) => {
      const angle = (index / narratives.length) * 2 * Math.PI;
      const radius = 100 + Math.random() * 50;
      
      return {
        id: `narrative-${index}`,
        type: item.narrative.storyType,
        content: item.content || `${item.narrative.storyType} narrative`,
        x: 200 + Math.cos(angle) * radius,
        y: 150 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: item.narrative.evolutionStage === 'converging' ? 20 : 
              item.narrative.evolutionStage === 'developing' ? 15 : 10
      };
    });

    setNodes(newNodes);
  }, [narratives]);

  // Force-directed layout simulation
  useEffect(() => {
    if (nodes.length === 0) return;

    const animate = () => {
      setNodes(prevNodes => {
        const newNodes = [...prevNodes];
        
        // Apply forces
        for (let i = 0; i < newNodes.length; i++) {
          const nodeA = newNodes[i];
          
          // Center attraction
          const centerX = 200;
          const centerY = 150;
          const centerDx = centerX - nodeA.x;
          const centerDy = centerY - nodeA.y;
          const centerDistance = Math.sqrt(centerDx * centerDx + centerDy * centerDy);
          
          if (centerDistance > 0) {
            nodeA.vx += (centerDx / centerDistance) * 0.001;
            nodeA.vy += (centerDy / centerDistance) * 0.001;
          }

          // Node repulsion
          for (let j = i + 1; j < newNodes.length; j++) {
            const nodeB = newNodes[j];
            const dx = nodeB.x - nodeA.x;
            const dy = nodeB.y - nodeA.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0 && distance < 100) {
              const force = 0.5 / (distance * distance);
              const fx = (dx / distance) * force;
              const fy = (dy / distance) * force;
              
              nodeA.vx -= fx;
              nodeA.vy -= fy;
              nodeB.vx += fx;
              nodeB.vy += fy;
            }

            // Attraction between related narratives
            if ((nodeA.type === 'living' && nodeB.type === 'ante') ||
                (nodeA.type === 'ante' && nodeB.type === 'grand')) {
              if (distance > 50 && distance < 150) {
                const attraction = 0.0005;
                const fx = (dx / distance) * attraction;
                const fy = (dy / distance) * attraction;
                
                nodeA.vx += fx;
                nodeA.vy += fy;
                nodeB.vx -= fx;
                nodeB.vy -= fy;
              }
            }
          }

          // Apply velocity with damping
          nodeA.x += nodeA.vx;
          nodeA.y += nodeA.vy;
          nodeA.vx *= 0.9;
          nodeA.vy *= 0.9;

          // Keep within bounds
          if (nodeA.x < nodeA.size) { nodeA.x = nodeA.size; nodeA.vx = 0; }
          if (nodeA.x > 400 - nodeA.size) { nodeA.x = 400 - nodeA.size; nodeA.vx = 0; }
          if (nodeA.y < nodeA.size) { nodeA.y = nodeA.size; nodeA.vy = 0; }
          if (nodeA.y > 300 - nodeA.size) { nodeA.y = 300 - nodeA.size; nodeA.vy = 0; }
        }

        return newNodes;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes.length]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, 400, 300);

      // Draw connections
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeA = nodes[i];
          const nodeB = nodes[j];
          const distance = Math.sqrt((nodeB.x - nodeA.x) ** 2 + (nodeB.y - nodeA.y) ** 2);
          
          // Draw connection if nodes are related and close
          if (distance < 120 && (
            (nodeA.type === 'living' && nodeB.type === 'ante') ||
            (nodeA.type === 'ante' && nodeB.type === 'grand') ||
            (nodeA.type === 'living' && nodeB.type === 'grand')
          )) {
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(node => {
        const colors = {
          living: { fill: '#10B981', stroke: '#059669' },
          ante: { fill: '#3B82F6', stroke: '#2563EB' },
          grand: { fill: '#F59E0B', stroke: '#D97706' }
        };

        const color = colors[node.type];
        
        // Node circle
        ctx.fillStyle = color.fill;
        ctx.strokeStyle = color.stroke;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        // Node label
        ctx.fillStyle = '#374151';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(node.type, node.x, node.y + 4);
      });

      requestAnimationFrame(draw);
    };

    draw();
  }, [nodes]);

  // Handle canvas clicks
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked node
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= node.size;
    });

    setSelectedNode(clickedNode || null);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          🕸️ {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Interactive network showing relationships between different story types
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Visualization */}
        <div className="lg:col-span-2">
          <div className="border rounded-lg overflow-hidden bg-gray-50">
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="cursor-pointer"
              onClick={handleCanvasClick}
            />
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <span className="text-xs text-gray-600">Living Stories</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full" />
              <span className="text-xs text-gray-600">Ante Narratives</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full" />
              <span className="text-xs text-gray-600">Grand Narratives</span>
            </div>
          </div>
        </div>

        {/* Information Panel */}
        <div className="space-y-4">
          {selectedNode ? (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Selected Node</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-blue-700">Type:</span>
                  <div className="font-medium text-blue-900 capitalize">{selectedNode.type}</div>
                </div>
                <div>
                  <span className="text-blue-700">Content:</span>
                  <div className="text-blue-800 text-xs mt-1">{selectedNode.content}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Click a node to explore</h4>
              <p className="text-sm text-gray-600">
                Tap any circle in the web to see details about that narrative element.
              </p>
            </div>
          )}

          {/* Narrative Types Explanation */}
          <div className="p-4 bg-amber-50 rounded-lg">
            <h4 className="font-medium text-amber-800 mb-2">Narrative Types</h4>
            <div className="space-y-2 text-xs text-amber-700">
              <div>
                <strong>Living Stories:</strong> Real experiences and concrete examples from your farming practice.
              </div>
              <div>
                <strong>Ante Narratives:</strong> Future aspirations and possibilities you're considering.
              </div>
              <div>
                <strong>Grand Narratives:</strong> Universal themes that connect to broader farming community stories.
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Narrative Metrics</h4>
            <div className="space-y-1 text-sm text-green-700">
              <div>Living Stories: {nodes.filter(n => n.type === 'living').length}</div>
              <div>Ante Narratives: {nodes.filter(n => n.type === 'ante').length}</div>
              <div>Grand Narratives: {nodes.filter(n => n.type === 'grand').length}</div>
              <div className="text-xs mt-2 text-green-600">
                Total narrative elements: {nodes.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}