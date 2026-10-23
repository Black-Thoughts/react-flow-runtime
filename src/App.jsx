import {ReactFlow, addEdge, useEdgesState, useNodesState, Background, Controls, useReactFlow, ReactFlowProvider, applyNodeChanges, ViewportPortal} from '@xyflow/react';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import {nanoid} from 'nanoid'
import {Editor} from './Components/Editor'
import { VideoNode } from './Components/Nodes/VideoNode';
import { AudioNode } from './Components/Nodes/AudioNode';
import { ImageNode } from './Components/Nodes/ImageNode';
import { TextNode } from './Components/Nodes/TextNode';
import { IFrameNode } from './Components/Nodes/IFrameNode';
import '@xyflow/react/dist/style.css';
import './App.css';

const nodeTypes = { 
  videoNode: VideoNode,
  audioNode: AudioNode,
  imageNode: ImageNode,
  textNode: TextNode,
  iFrameNode: IFrameNode,
};

const initialNodes = [
  // {id: "1", position: {x:0, y:0}, data: {label: "1"}},
  // {id: "2", position: {x:0, y:100}, data: {label: "2"}},
  {
    id: '3',
    type: 'videoNode',
    position: { x: 250, y: 50 },
    data: { label: 'Mumbo Jumbo', url: '/Mumbo_Jumbo.webm' },
  },
  {
    id: '4',
    type: 'audioNode',
    position: { x: 250, y: 150 },
    data: { label: 'No Fairytales Involved', url: '/noFairytales.mp3' },
  },
  {
    id: '5',
    type: 'imageNode',
    position: { x: 250, y: 250 },
    data: { label: 'Blobs', url: '/abstract.jpg' },
  },
  {
    id: '6',
    type: 'textNode',
    position: { x: -50, y: 50 },
    data: { label: 'An Oath', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
  },
  {
    id: '7',
    type: 'iFrameNode',
    position: { x: -50, y: 150 },
    data: { label: 'Hellraiser Lyrics', url: 'https://docs.google.com/document/d/1LGKJGKh1PuKJlJE7Dcr000ExDCALWehCva2wLVwlVYg/edit?tab=t.0'},
  },
];

const initialEdges = [{id: "e1-2", source: "1", target: "2"}];

function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isEditing] = useState(true);
  const [editNode, setEditNode] = useState(false);
  const lastClickTime = useRef(0);
  const {screenToFlowPosition} = useReactFlow();



  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onPaneDoubleClick = useCallback((e) => {
    if (!isEditing) return;

    console.log("double click");
    const position = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    })

    const newNode = {
      id: nanoid(),
      type: 'textNode',
      position,
      data: {label: 'New Node', text: "Testing testing 123"},
    }

    setNodes((prevNodes) => [...prevNodes, newNode])
  }, [screenToFlowPosition, setNodes])

  const onPaneClick = useCallback((e) => {
    console.log('pane click');
    const now = Date.now();
    if (now - lastClickTime.current < 300) {
      console.log('pane double click');
      onPaneDoubleClick(e);
    }

    lastClickTime.current = now;
  }, [onPaneDoubleClick])

  const onNodeDoubleClick = (e, node) => {
    if (isEditing) setEditNode(node);
  }

  return (
    <div id='container'>
      <ReactFlow nodes={nodes} edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      noWheelClassName='text-node, iframe-node'
      onPaneClick={onPaneClick}
      onNodeDoubleClick={onNodeDoubleClick}
      >
      <Controls/>
      </ReactFlow>
      {editNode && <Editor nodeId={editNode.id} setVisible={() => setEditNode(null)}/>}
    </div>
  );
}

const App = () => {

  return (
    <>
      <ReactFlowProvider>
        <FlowEditor/>
      </ReactFlowProvider>
    </>
  );
};

export default App;