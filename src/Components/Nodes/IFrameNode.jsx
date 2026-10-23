// import React from 'react';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useReactFlow, Handle, NodeResizer, Position, useUpdateNodeInternals } from '@xyflow/react';

export function IFrameNode({ id, data }) {
    const updateNodeInternals = useUpdateNodeInternals();
    const {getNode, updateNode, updateNodeData} = useReactFlow();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const collapseNode = useCallback(() => {
        const node = getNode(id);
        if (!node) return;

        updateNodeData(id, {
            previousSize: {
                width: node.measured?.width ?? node.width,
                height: node.measured?.height ?? node.height,
            },
        })

        updateNode(id, {
            width: '12vw',
            height: '4.5vh',
            style: {width: '12vw', height: '4.5vh'},
        });
    }, []);

    const expandNode = () => {
        const node = getNode(id);
        if (!node) return;

        const size = data.previousSize ?? {
            width: '20vw',
            height: '30vh',
        };


        updateNode(id, {
            width: size.width,
            height: size.height,
            style: {width: size.width, height: size.height},
        });
    };


    useEffect(()=> {
        if (!isExpanded) collapseNode();
        else expandNode();
    }, [isExpanded, collapseNode]);

    useLayoutEffect(()=> {
        console.log("updating internals")
        updateNodeInternals(id);
    }, [id, isExpanded, updateNodeInternals])

  return (
    <div className={`${isExpanded ? 'expanded' : 'collapsed'}`}>
        <NodeResizer
            isVisible={isExpanded}
            minWidth={200}
            minHeight={100}
            onResizeStart={() => setIsResizing(true)}
            onResizeEnd={() => setIsResizing(false)}
        />
        <Handle type="target" position={Position.Top} />
        <div className='nodeHeader' onClick={() => setIsExpanded(!isExpanded)}>
            {data.label || 'IFrame Node'}
        </div>
        {isExpanded && 
            <iframe
                className="nodrag nowheel"
                src={data.url}
                style={{ boxSizing: 'border-box', width: '100%', height: '100%', borderRadius: 4, pointerEvents: isResizing ? 'none' : 'auto' }}
            />
        }

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
