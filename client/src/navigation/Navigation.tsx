import '../css/Modal.css'
import '../css/Navigation.css'

import { faArrowRotateRight, faCode, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import {
  faArrowUpRightFromSquare,
  faBars,
  faCloudArrowUp,
  faDownload,
  faFileCode,
  faFolderOpen,
  faGear,
  faHammer,
  faLayerGroup,
  faShield,
  faSitemap,
  faUpload,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAtom } from 'jotai'
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'

import { lean4webConfig } from '../../config'
import { LeanWebProject, LeanWebUnit } from '../api/project-types'
import ZulipIcon from '../assets/zulip.svg'
import { codeAtom } from '../editor/code-atoms'
import ImpressumPopup from '../Popups/Impressum'
import LoadUrlPopup from '../Popups/LoadUrl'
import LoadZulipPopup from '../Popups/LoadZulip'
import PrivacyPopup from '../Popups/PrivacyPolicy'
import ToolsPopup from '../Popups/Tools'
import { mobileAtom } from '../settings/settings-atoms'
import { SettingsPopup } from '../settings/SettingsPopup'
import { setImportUrlAndProjectAtom } from '../store/import-atoms'
import { currentProjectAtom, visibleProjectsAtom } from '../store/project-atoms'
import { urlArgsAtom, urlArgsStableAtom } from '../store/url-atoms'
import { save } from '../utils/SaveToFile'
import { Dropdown } from './Dropdown'
import { NavButton } from './NavButton'

function UnitMenuItem({
  project,
  unit,
  closeUnits,
}: {
  project: LeanWebProject
  unit: LeanWebUnit
  closeUnits: () => void
}) {
  const [, setImportUrlAndProject] = useAtom(setImportUrlAndProjectAtom)
  const [urlArgs] = useAtom(urlArgsStableAtom)
  const [, setUrlArgs] = useAtom(urlArgsAtom)
  const [open, setOpen] = useState(false)

  if (unit.units) {
    return (
      <Dropdown
        open={open}
        setOpen={setOpen}
        icon={faFolderOpen}
        text={unit.name}
        useOverlay={false}
        onClick={(ev) => ev.stopPropagation()}
      >
        {unit.units.map((child) => (
          <UnitMenuItem
            key={`${project.folder}-${unit.name}-${child.name}`}
            project={project}
            unit={child}
            closeUnits={closeUnits}
          />
        ))}
      </Dropdown>
    )
  }

  if (unit.route) {
    return (
      <NavButton
        icon={faSitemap}
        text={unit.name}
        title={`${project.config.name}: ${unit.name}`}
        onClick={() => {
          setUrlArgs({
            ...urlArgs,
            project: project.config.default ? undefined : project.folder,
            route: unit.route,
            url: undefined,
            code: undefined,
            codez: undefined,
          })
          closeUnits()
        }}
      />
    )
  }

  if (unit.file) {
    return (
      <NavButton
        icon={faFileCode}
        text={unit.name}
        title={`${project.config.name}: ${unit.name}`}
        onClick={() => {
          setImportUrlAndProject({
            url: `${window.location.origin}/api/example/${project.folder}/${unit.file}`,
            project: project.folder,
          })
          closeUnits()
        }}
      />
    )
  }

  return null
}

/** The menu items either appearing inside the dropdown or outside */
function FlexibleMenu({
  isInDropdown = false,
  setOpenNav,
  openUnit,
  setOpenUnit,
  openLoad,
  setOpenLoad,
  setContent,
  setLoadUrlOpen,
  setLoadZulipOpen,
}: {
  isInDropdown: boolean
  setOpenNav: Dispatch<SetStateAction<boolean>>
  openUnit: boolean
  setOpenUnit: Dispatch<SetStateAction<boolean>>
  openLoad: boolean
  setOpenLoad: Dispatch<SetStateAction<boolean>>
  setContent: (code: string) => void
  setLoadUrlOpen: Dispatch<SetStateAction<boolean>>
  setLoadZulipOpen: Dispatch<SetStateAction<boolean>>
}) {
  const [project] = useAtom(currentProjectAtom)
  const loadFileFromDisk = (event: ChangeEvent<HTMLInputElement>) => {
    console.debug('Loading file from disk')
    const fileToLoad = event.target.files![0]
    var fileReader = new FileReader()
    fileReader.onload = (fileLoadedEvent) => {
      var textFromFileLoaded = fileLoadedEvent.target!.result as string
      setContent(textFromFileLoaded)
    }
    fileReader.readAsText(fileToLoad, 'UTF-8')
    // Manually close the menu as we prevent it closing below.
    setOpenLoad(false)
  }

  return (
    <>
      <Dropdown
        open={openUnit}
        setOpen={setOpenUnit}
        icon={faLayerGroup}
        text="Units"
        useOverlay={isInDropdown}
        onClick={() => {
          setOpenLoad(false)
          !isInDropdown && setOpenNav(false)
        }}
      >
        {(project?.config.units ?? project?.config.examples ?? []).map((unit) => (
          <UnitMenuItem
            key={`${project?.folder}-${unit.name}`}
            project={project!}
            unit={unit}
            closeUnits={() => setOpenUnit(false)}
          />
        ))}
      </Dropdown>
      <Dropdown
        open={openLoad}
        setOpen={setOpenLoad}
        icon={faUpload}
        text="Load"
        useOverlay={isInDropdown}
        onClick={() => {
          setOpenUnit(false)
          !isInDropdown && setOpenNav(false)
        }}
      >
        <input
          id="file-upload"
          type="file"
          onChange={loadFileFromDisk}
          onClick={(ev) => ev.stopPropagation()}
        />
        {/* Need `ev.stopPropagation` to prevent closing until the file is loaded.
          Otherwise the file-upload is destroyed too early. */}
        <label htmlFor="file-upload" className="nav-link" onClick={(ev) => ev.stopPropagation()}>
          <FontAwesomeIcon icon={faUpload} /> Load file from disk
        </label>
        <NavButton
          icon={faCloudArrowUp}
          text="Load from URL"
          onClick={() => {
            setLoadUrlOpen(true)
          }}
        />
        <NavButton
          iconElement={<ZulipIcon />}
          text="Load Zulip Message"
          onClick={() => {
            setLoadZulipOpen(true)
          }}
        />
      </Dropdown>
    </>
  )
}

/** The Navigation menu */
export function Menu({
  setContent,
  restart,
  codeMirror,
  setCodeMirror,
}: {
  setContent: (code: string) => void
  restart?: () => void
  codeMirror: boolean
  setCodeMirror: Dispatch<SetStateAction<boolean>>
}) {
  const [visibleProjects] = useAtom(visibleProjectsAtom)
  const [project, setProject] = useAtom(currentProjectAtom)
  const [code] = useAtom(codeAtom)

  // state for handling the dropdown menus
  const [openNav, setOpenNav] = useState(false)
  const [openUnit, setOpenUnit] = useState(false)
  const [openLoad, setOpenLoad] = useState(false)
  const [loadUrlOpen, setLoadUrlOpen] = useState(false)
  const [loadZulipOpen, setLoadZulipOpen] = useState(false)

  // state for the popups
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [impressumOpen, setImpressumOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const [mobile] = useAtom(mobileAtom)

  const hasImpressum = lean4webConfig.impressum || lean4webConfig.contactDetails

  return (
    <div className="menu">
      {project && (
        <select
          name="leanVersion"
          value={project.folder}
          onChange={(ev) => {
            setProject(ev.target.value)
            console.log(`set Lean project to: ${ev.target.value}`)
          }}
        >
          {project.folder}
          {visibleProjects.map((proj) => (
            <option key={proj.folder} value={proj.folder}>
              {proj.config.name}
            </option>
          ))}
        </select>
      )}
      {mobile && (
        <NavButton
          icon={faCode}
          text={codeMirror ? 'Lean' : 'Text'}
          onClick={() => {
            setCodeMirror(!codeMirror)
          }}
        />
      )}
      {!mobile && (
        <FlexibleMenu
          isInDropdown={false}
          setOpenNav={setOpenNav}
          openUnit={openUnit}
          setOpenUnit={setOpenUnit}
          openLoad={openLoad}
          setOpenLoad={setOpenLoad}
          setContent={setContent}
          setLoadUrlOpen={setLoadUrlOpen}
          setLoadZulipOpen={setLoadZulipOpen}
        />
      )}
      <Dropdown
        open={openNav}
        setOpen={setOpenNav}
        icon={openNav ? faXmark : faBars}
        onClick={() => {
          setOpenUnit(false)
          setOpenLoad(false)
        }}
      >
        {mobile && (
          <FlexibleMenu
            isInDropdown={true}
            setOpenNav={setOpenNav}
            openUnit={openUnit}
            setOpenUnit={setOpenUnit}
            openLoad={openLoad}
            setOpenLoad={setOpenLoad}
            setContent={setContent}
            setLoadUrlOpen={setLoadUrlOpen}
            setLoadZulipOpen={setLoadZulipOpen}
          />
        )}
        <NavButton
          icon={faGear}
          text="Settings"
          onClick={() => {
            setSettingsOpen(true)
          }}
        />
        <NavButton icon={faHammer} text="Lean Info" onClick={() => setToolsOpen(true)} />
        <NavButton icon={faArrowRotateRight} text="Restart server" onClick={restart} />
        <NavButton
          icon={faDownload}
          text="Save file"
          onClick={() => {
            if (code !== undefined) save(code)
          }}
        />
        <NavButton
          icon={faShield}
          text={'Privacy policy'}
          onClick={() => {
            setPrivacyOpen(true)
          }}
        />
        {hasImpressum && (
          <NavButton
            icon={faInfoCircle}
            text={'Impressum'}
            onClick={() => {
              setImpressumOpen(true)
            }}
          />
        )}
        <NavButton
          icon={faArrowUpRightFromSquare}
          text="Lean community"
          href="https://leanprover-community.github.io/"
        />
        <NavButton icon={faArrowUpRightFromSquare} text="Lean FRO" href="https://lean-lang.org" />
        <NavButton
          icon={faArrowUpRightFromSquare}
          text="GitHub"
          href="https://github.com/leanprover-community/lean4web"
        />
      </Dropdown>
      <PrivacyPopup open={privacyOpen} handleClose={() => setPrivacyOpen(false)} />
      {hasImpressum && (
        <ImpressumPopup open={impressumOpen} handleClose={() => setImpressumOpen(false)} />
      )}
      {project && (
        <ToolsPopup
          open={toolsOpen}
          handleClose={() => setToolsOpen(false)}
          project={project.folder}
        />
      )}
      <SettingsPopup
        open={settingsOpen}
        handleClose={() => setSettingsOpen(false)}
        closeNav={() => setOpenNav(false)}
      />
      <LoadUrlPopup open={loadUrlOpen} handleClose={() => setLoadUrlOpen(false)} />
      <LoadZulipPopup
        open={loadZulipOpen}
        handleClose={() => setLoadZulipOpen(false)}
        setContent={setContent}
      />
    </div>
  )
}
