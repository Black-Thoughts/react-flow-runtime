// import React from 'react';
import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

export function ImageNode({ data }) {
    const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="video-node">
        <Handle type="target" position={Position.Top} />
        <div className='nodeHeader' onClick={() => setIsExpanded(!isExpanded)}>
            {data.label || 'Image Node'}
        </div>
        {isExpanded && 
            <img
                className="nodrag nowheel"
                src={data.url}
                style={{ width: '20vw', borderRadius: 4, pointerEvents: 'all' }}
            />
        }

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
