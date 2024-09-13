import { useCallback } from "react"
// import { useLocation, useNavigate } from "react-router-dom"

import qs from "qs"

export function useQueryState<T>(query: string, initial: T, converter: (value: string) => T): [T, (value: T) => void] {
  // const location = useLocation()
  // const navigate = useNavigate()
  const location = document.location

  const setQuery = useCallback((value: T) => {
    const navigate = (loc: string) => window.history.replaceState(null, "", loc)

    const existingQueries = qs.parse(location.search, { ignoreQueryPrefix: true })

    const queryString = qs.stringify(
      { ...existingQueries, [query]: value },
      { skipNulls: true }
    )

    navigate(`${location.pathname}?${queryString}`)
  }, [/*navigate,*/ location, query])

  const value = qs.parse(location.search, { ignoreQueryPrefix: true })[query] as (string | null)
  return [value? converter(value) : initial, setQuery]
}
