/** Expected arguments which can be provided in the URL. */

/**
 * The arguments which can be provided in the location hash.
 *
 * Note that the following parameters are exclusive (meaning only one of them will be considered):
 * - url, code, codez
 */
export interface UrlArgs {
  project?: string
  route?: string
  url?: string
  code?: string
  codez?: string
}
