import { useState } from 'react'
import { useIsomorphicEffect } from './useIsomorphicEffect'

export const breakpointMap = {
  sm: 576,
  md: 852,
  lg: 968,
  xl: 1080,
  '2lg': 1200,
}

/**
 * Can't use the media queries from "base.mediaQueries" because of how matchMedia works
 * In order for the listener to trigger we need have have the media query with a range, e.g.
 * (min-width: 370px) and (max-width: 576px)
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList
 */
const mediaQueries = (() => {
  let prevMinWidth = 0

  return Object.keys(breakpointMap).reduce((accum, size, index) => {
    // Largest size is just a min-width of second highest max-width
    if (index === Object.keys(breakpointMap).length - 1) {
      return { ...accum, [size]: `(min-width: ${prevMinWidth}px)` }
    }

    const minWidth = prevMinWidth
    const breakpoint = breakpointMap[size]

    // Min width for next iteration
    prevMinWidth = breakpoint + 1

    return { ...accum, [size]: `(min-width: ${minWidth}px) and (max-width: ${breakpoint}px)` }
  }, {})
})()

const getKey = (size) => `is${size.charAt(0).toUpperCase()}${size.slice(1)}`

const getState = () => {
  const s = Object.keys(mediaQueries).reduce((accum, size) => {
    const key = getKey(size)
    if (typeof window === 'undefined') {
      return {
        ...accum,
        [key]: false,
      }
    }

    const mql = typeof window?.matchMedia === 'function' ? window.matchMedia(mediaQueries[size]) : null
    return { ...accum, [key]: mql?.matches ?? false }
  }, {})
  return s
}

const useMatchBreakpoints = () => {
  const [state, setState] = useState(() => getState())

  useIsomorphicEffect(() => {
    // Create listeners for each media query returning a function to unsubscribe
    const handlers = Object.keys(mediaQueries).map((size) => {
      let mql
      let handler

      if (typeof window?.matchMedia === 'function') {
        mql = window.matchMedia(mediaQueries[size])

        handler = (matchMediaQuery) => {
          const key = getKey(size)
          setState((prevState) => ({
            ...prevState,
            [key]: matchMediaQuery.matches,
          }))
        }

        // Safari < 14 fix
        if (mql.addEventListener) {
          mql.addEventListener('change', handler)
        }
      }

      return () => {
        // Safari < 14 fix
        if (mql?.removeEventListener) {
          mql.removeEventListener('change', handler)
        }
      }
    })

    setState(getState())

    return () => {
      handlers.forEach((unsubscribe) => {
        unsubscribe()
      })
    }
  }, [])

  return {
    ...state,
    isMobile: state.isSm,
    isTablet: state.isMd || state.isLg,
    isDesktop: state.isXlg || state.is2xl,
  }
}

export default useMatchBreakpoints
