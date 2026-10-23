// import React from 'react';
import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

export function VideoNode({ data }) {
    const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="video-node">
        <Handle type="target" position={Position.Top} />
        <div className='nodeHeader' style={{ fontWeight: "bold", marginBottom: 6 }} onClick={() => setIsExpanded(!isExpanded)}>
            {data.label || 'Video Node'}
        </div>
        {isExpanded && 
            <video
                className="nodrag nowheel"
                src={data.url}
                controls
                style={{ width: '20vw', borderRadius: 4, pointerEvents: 'all' }}
            />
        }

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
