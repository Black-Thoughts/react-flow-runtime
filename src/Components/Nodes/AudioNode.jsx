// import React from 'react';
import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

export function AudioNode({ data }) {
    const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="audio-node">
        <Handle type="target" position={Position.Top} />
        <div className='nodeHeader' onClick={() => setIsExpanded(!isExpanded)}>
            {data.label || 'Video Node'}
        </div>
        {isExpanded && 
            <audio
                className="nodrag nowheel"
                src={data.url}
                controls
                style={{ width: '100%', borderRadius: 4, pointerEvents: 'all' }}
            />
        }

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
