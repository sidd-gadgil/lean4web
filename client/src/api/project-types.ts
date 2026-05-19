/** A unit can be any Lean file or project route which belongs to the project.
 * The editor just reads the file content, but it makes sense for maintainability
 * that you ensure the Lean project actually builds the file. */
export type LeanWebUnit = {
  /** Display name used in the `Units` menu */
  name: string
  /** File to load; relative path in `lean4web/Projects/<project_folder>/` */
  file?: string
  /** Internal app route to open instead of loading a file */
  route?: string
  /** Nested units shown as submenus */
  units?: LeanWebUnit[]
}

/** Configuration from a project's `leanweb-config.json` file. */
export type LeanWebProjectConfig = {
  /** Display name; shown in selection menu */
  name: string
  /** Hidden projects do not appear in the dropdown and are only accessible through the direct link */
  hidden: boolean
  /** The default project. There must be exactly one project marked as default */
  default: boolean
  /** A nested list of units which are added under the menu `Units` */
  units?: LeanWebUnit[]
  /** Legacy flat examples list, shown as units if `units` is absent */
  examples?: LeanWebUnit[]
}

/* A project */
export type LeanWebProject = {
  /* The folder name of the project. */
  folder: string
  config: LeanWebProjectConfig
}
