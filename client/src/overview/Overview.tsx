import '../css/Overview.css'

import { faFileCode } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAtom } from 'jotai'

import { setImportUrlAndProjectAtom } from '../store/import-atoms'
import { currentProjectAtom } from '../store/project-atoms'

type OverviewNode = {
  id: string
  label?: string
  file?: string
  x: number
  y: number
}

type OverviewEdge = {
  from: string
  to: string
}

const leanLangurNodes: OverviewNode[] = [
  { id: 'SimpleTerms', file: 'LeanLangur/SimpleTerms.lean', x: 80, y: 60 },
  { id: 'PropsProofs', label: 'PropsProofs', file: 'LeanLangur/PropsProofs.lean', x: 260, y: 60 },
  { id: 'SumToN', file: 'LeanLangur/SumToN.lean', x: 440, y: 60 },
  { id: 'SmallestNat', file: 'LeanLangur/SmallestNat.lean', x: 620, y: 60 },
  { id: 'ListOps', file: 'LeanLangur/ListOps.lean', x: 800, y: 60 },
  { id: 'People', file: 'LeanLangur/People.lean', x: 80, y: 180 },
  { id: 'BinTree', file: 'LeanLangur/BinTree.lean', x: 260, y: 180 },
  { id: 'IsEven', file: 'LeanLangur/IsEven.lean', x: 440, y: 180 },
  { id: 'Adder', file: 'LeanLangur/Adder.lean', x: 620, y: 180 },
  { id: 'NonAtom', file: 'LeanLangur/NonAtom.lean', x: 800, y: 180 },
  { id: 'Smallest', file: 'LeanLangur/Smallest.lean', x: 980, y: 180 },
  { id: 'Largest', file: 'LeanLangur/Largest.lean', x: 1160, y: 180 },
  { id: 'FunEquality', file: 'LeanLangur/FunEquality.lean', x: 1340, y: 180 },
  { id: 'FibM', file: 'LeanLangur/FibM.lean', x: 620, y: 300 },
  { id: 'CatalanM', file: 'LeanLangur/CatalanM.lean', x: 800, y: 300 },
  { id: 'Sorted', file: 'LeanLangur/Sorted.lean', x: 980, y: 300 },
  { id: 'QuickSort', file: 'LeanLangur/QuickSort.lean', x: 1160, y: 300 },
  { id: 'SelectionSort', file: 'LeanLangur/SelectionSort.lean', x: 1340, y: 300 },
  { id: 'BinarySearchTree', file: 'LeanLangur/BinarySearchTree.lean', x: 440, y: 300 },
  {
    id: 'PowerIrrational',
    label: 'PowerIrrationals',
    file: 'LeanLangur/PowerIrrational.lean',
    x: 1520,
    y: 180,
  },
  { id: 'Basic', file: 'LeanLangur/Basic.lean', x: 80, y: 420 },
  { id: 'StackMachine', file: 'LeanLangur/StackMachine.lean', x: 260, y: 420 },
  { id: 'PyFor', file: 'LeanLangur/PyFor.lean', x: 620, y: 420 },
  { id: 'LoadFile', file: 'LeanLangur/LoadFile.lean', x: 800, y: 420 },
  { id: 'FileM', file: 'LeanLangur/FileM.lean', x: 980, y: 420 },
  { id: 'LangurLang', file: 'LeanLangur/LangurLang.lean', x: 800, y: 540 },
  { id: 'LangurLeaps', file: 'LeanLangur/LangurLeaps.lean', x: 980, y: 540 },
  { id: 'TryInterpret', file: 'LeanLangur/TryInterpret.lean', x: 440, y: 540 },
  { id: 'Combinations', file: 'LeanLangur/Combinations.lean', x: 980, y: 660 },
  { id: 'Eratosthenes', file: 'LeanLangur/Eratosthenes.lean', x: 620, y: 660 },
]

const leanLangurEdges: OverviewEdge[] = [
  { from: 'SimpleTerms', to: 'PropsProofs' },
  { from: 'PropsProofs', to: 'SumToN' },
  { from: 'SumToN', to: 'SmallestNat' },
  { from: 'SmallestNat', to: 'ListOps' },
  { from: 'SmallestNat', to: 'FibM' },
  { from: 'People', to: 'IsEven' },
  { from: 'People', to: 'Adder' },
  { from: 'ListOps', to: 'BinTree' },
  { from: 'ListOps', to: 'Adder' },
  { from: 'FibM', to: 'CatalanM' },
  { from: 'Adder', to: 'Largest' },
  { from: 'Adder', to: 'FunEquality' },
  { from: 'Adder', to: 'FibM' },
  { from: 'BinTree', to: 'BinarySearchTree' },
  { from: 'BinTree', to: 'FunEquality' },
  { from: 'BinTree', to: 'IsEven' },
  { from: 'IsEven', to: 'Sorted' },
  { from: 'IsEven', to: 'NonAtom' },
  { from: 'IsEven', to: 'Smallest' },
  { from: 'IsEven', to: 'Largest' },
  { from: 'Sorted', to: 'QuickSort' },
  { from: 'Sorted', to: 'SelectionSort' },
  { from: 'FibM', to: 'PyFor' },
  { from: 'CatalanM', to: 'Combinations' },
  { from: 'IsEven', to: 'Eratosthenes' },
  { from: 'Basic', to: 'StackMachine' },
  { from: 'FunEquality', to: 'PowerIrrational' },
  { from: 'PyFor', to: 'LoadFile' },
  { from: 'LoadFile', to: 'FileM' },
  { from: 'PyFor', to: 'LangurLang' },
  { from: 'LangurLang', to: 'LangurLeaps' },
  { from: 'FibM', to: 'TryInterpret' },
  { from: 'NonAtom', to: 'TryInterpret' },
]

const nodeWidth = 130
const nodeHeight = 40

export function Overview() {
  const [project] = useAtom(currentProjectAtom)
  const [, setImportUrlAndProject] = useAtom(setImportUrlAndProjectAtom)
  const nodeById = new Map(leanLangurNodes.map((node) => [node.id, node]))

  if (!project || project.folder !== 'LeanLangur') {
    return (
      <main className="overview">
        <p>No overview is configured for this project.</p>
      </main>
    )
  }

  const openFile = (node: OverviewNode) => {
    if (!node.file) return
    setImportUrlAndProject({
      url: `${window.location.origin}/api/example/${project.folder}/${node.file}`,
      project: project.folder,
    })
  }

  return (
    <main className="overview">
      <div className="overview-toolbar">
        <h1>LeanLangur Overview</h1>
        <p>Dependency diagram from the README. Click a file node to open that unit.</p>
      </div>
      <div className="overview-canvas" aria-label="LeanLangur dependency overview">
        <svg viewBox="0 0 1700 760" role="img">
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
          {leanLangurEdges.map((edge) => {
            const from = nodeById.get(edge.from)
            const to = nodeById.get(edge.to)
            if (!from || !to) return null
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                className="overview-edge"
                x1={from.x + nodeWidth / 2}
                y1={from.y + nodeHeight / 2}
                x2={to.x + nodeWidth / 2}
                y2={to.y + nodeHeight / 2}
                markerEnd="url(#arrow)"
              />
            )
          })}
          {leanLangurNodes.map((node) => (
            <g
              key={node.id}
              className="overview-node"
              role="link"
              tabIndex={0}
              onClick={() => openFile(node)}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') openFile(node)
              }}
            >
              <rect x={node.x} y={node.y} width={nodeWidth} height={nodeHeight} rx="6" />
              <text x={node.x + nodeWidth / 2} y={node.y + 25} textAnchor="middle">
                {node.label ?? node.id}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="overview-units">
        {leanLangurNodes.map((node) => (
          <button key={node.id} type="button" onClick={() => openFile(node)}>
            <FontAwesomeIcon icon={faFileCode} />
            {node.label ?? node.id}
          </button>
        ))}
      </div>
    </main>
  )
}
