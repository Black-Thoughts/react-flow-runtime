// import React from 'react';
import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

export function TextNode({ data }) {
    const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="text-node">
        <Handle type="target" position={Position.Top} />
        <div className='nodeHeader' onClick={() => setIsExpanded(!isExpanded)}>
            {data.label || 'Text Node'}
        </div>
        {isExpanded && 
            <div style={{width: '20vw', height: '30vh', fontSize: '14px', overflowY: 'scroll'}}>
                {/* <p style={{height: '10rem', overflow: scroll, border: 'solid 0.4em #16b10e'}}> */}
                  {data.text}
                  {/* </p> */}
            </div>
        }

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
