/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as toolsWordCounterImport } from './routes/(tools)/word-counter'
import { Route as toolsVideoTrimmerImport } from './routes/(tools)/video-trimmer'
import { Route as toolsLoremIpsumImport } from './routes/(tools)/lorem-ipsum'
import { Route as toolsImagePaletteGeneratorImport } from './routes/(tools)/image-palette-generator'
import { Route as toolsImageCropperImport } from './routes/(tools)/image-cropper'
import { Route as toolsImageCompressorImport } from './routes/(tools)/image-compressor'
import { Route as toolsDiffCheckerImport } from './routes/(tools)/diff-checker'
import { Route as toolsColorPickerImport } from './routes/(tools)/color-picker'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const toolsWordCounterRoute = toolsWordCounterImport.update({
  id: '/(tools)/word-counter',
  path: '/word-counter',
  getParentRoute: () => rootRoute,
} as any)

const toolsVideoTrimmerRoute = toolsVideoTrimmerImport.update({
  id: '/(tools)/video-trimmer',
  path: '/video-trimmer',
  getParentRoute: () => rootRoute,
} as any)

const toolsLoremIpsumRoute = toolsLoremIpsumImport.update({
  id: '/(tools)/lorem-ipsum',
  path: '/lorem-ipsum',
  getParentRoute: () => rootRoute,
} as any)

const toolsImagePaletteGeneratorRoute = toolsImagePaletteGeneratorImport.update(
  {
    id: '/(tools)/image-palette-generator',
    path: '/image-palette-generator',
    getParentRoute: () => rootRoute,
  } as any,
)

const toolsImageCropperRoute = toolsImageCropperImport.update({
  id: '/(tools)/image-cropper',
  path: '/image-cropper',
  getParentRoute: () => rootRoute,
} as any)

const toolsImageCompressorRoute = toolsImageCompressorImport.update({
  id: '/(tools)/image-compressor',
  path: '/image-compressor',
  getParentRoute: () => rootRoute,
} as any)

const toolsDiffCheckerRoute = toolsDiffCheckerImport.update({
  id: '/(tools)/diff-checker',
  path: '/diff-checker',
  getParentRoute: () => rootRoute,
} as any)

const toolsColorPickerRoute = toolsColorPickerImport.update({
  id: '/(tools)/color-picker',
  path: '/color-picker',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/(tools)/color-picker': {
      id: '/(tools)/color-picker'
      path: '/color-picker'
      fullPath: '/color-picker'
      preLoaderRoute: typeof toolsColorPickerImport
      parentRoute: typeof rootRoute
    }
    '/(tools)/diff-checker': {
      id: '/(tools)/diff-checker'
      path: '/diff-checker'
      fullPath: '/diff-checker'
      preLoaderRoute: typeof toolsDiffCheckerImport
      parentRoute: typeof rootRoute
    }
    '/(tools)/image-compressor': {
      id: '/(tools)/image-compressor'
      path: '/image-compressor'
      fullPath: '/image-compressor'
      preLoaderRoute: typeof toolsImageCompressorImport
      parentRoute: typeof rootRoute
    }
    '/(tools)/image-cropper': {
      id: '/(tools)/image-cropper'
      path: '/image-cropper'
      fullPath: '/image-cropper'
      preLoaderRoute: typeof toolsImageCropperImport
      parentRoute: typeof rootRoute
    }
    '/(tools)/image-palette-generator': {
      id: '/(tools)/image-palette-generator'
      path: '/image-palette-generator'
      fullPath: '/image-palette-generator'
      preLoaderRoute: typeof toolsImagePaletteGeneratorImport
      parentRoute: typeof rootRoute
    }
    '/(tools)/lorem-ipsum': {
      id: '/(tools)/lorem-ipsum'
      path: '/lorem-ipsum'
      fullPath: '/lorem-ipsum'
      preLoaderRoute: typeof toolsLoremIpsumImport
      parentRoute: typeof rootRoute
    }
    '/(tools)/video-trimmer': {
      id: '/(tools)/video-trimmer'
      path: '/video-trimmer'
      fullPath: '/video-trimmer'
      preLoaderRoute: typeof toolsVideoTrimmerImport
      parentRoute: typeof rootRoute
    }
    '/(tools)/word-counter': {
      id: '/(tools)/word-counter'
      path: '/word-counter'
      fullPath: '/word-counter'
      preLoaderRoute: typeof toolsWordCounterImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/color-picker': typeof toolsColorPickerRoute
  '/diff-checker': typeof toolsDiffCheckerRoute
  '/image-compressor': typeof toolsImageCompressorRoute
  '/image-cropper': typeof toolsImageCropperRoute
  '/image-palette-generator': typeof toolsImagePaletteGeneratorRoute
  '/lorem-ipsum': typeof toolsLoremIpsumRoute
  '/video-trimmer': typeof toolsVideoTrimmerRoute
  '/word-counter': typeof toolsWordCounterRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/color-picker': typeof toolsColorPickerRoute
  '/diff-checker': typeof toolsDiffCheckerRoute
  '/image-compressor': typeof toolsImageCompressorRoute
  '/image-cropper': typeof toolsImageCropperRoute
  '/image-palette-generator': typeof toolsImagePaletteGeneratorRoute
  '/lorem-ipsum': typeof toolsLoremIpsumRoute
  '/video-trimmer': typeof toolsVideoTrimmerRoute
  '/word-counter': typeof toolsWordCounterRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/(tools)/color-picker': typeof toolsColorPickerRoute
  '/(tools)/diff-checker': typeof toolsDiffCheckerRoute
  '/(tools)/image-compressor': typeof toolsImageCompressorRoute
  '/(tools)/image-cropper': typeof toolsImageCropperRoute
  '/(tools)/image-palette-generator': typeof toolsImagePaletteGeneratorRoute
  '/(tools)/lorem-ipsum': typeof toolsLoremIpsumRoute
  '/(tools)/video-trimmer': typeof toolsVideoTrimmerRoute
  '/(tools)/word-counter': typeof toolsWordCounterRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/color-picker'
    | '/diff-checker'
    | '/image-compressor'
    | '/image-cropper'
    | '/image-palette-generator'
    | '/lorem-ipsum'
    | '/video-trimmer'
    | '/word-counter'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/color-picker'
    | '/diff-checker'
    | '/image-compressor'
    | '/image-cropper'
    | '/image-palette-generator'
    | '/lorem-ipsum'
    | '/video-trimmer'
    | '/word-counter'
  id:
    | '__root__'
    | '/'
    | '/(tools)/color-picker'
    | '/(tools)/diff-checker'
    | '/(tools)/image-compressor'
    | '/(tools)/image-cropper'
    | '/(tools)/image-palette-generator'
    | '/(tools)/lorem-ipsum'
    | '/(tools)/video-trimmer'
    | '/(tools)/word-counter'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  toolsColorPickerRoute: typeof toolsColorPickerRoute
  toolsDiffCheckerRoute: typeof toolsDiffCheckerRoute
  toolsImageCompressorRoute: typeof toolsImageCompressorRoute
  toolsImageCropperRoute: typeof toolsImageCropperRoute
  toolsImagePaletteGeneratorRoute: typeof toolsImagePaletteGeneratorRoute
  toolsLoremIpsumRoute: typeof toolsLoremIpsumRoute
  toolsVideoTrimmerRoute: typeof toolsVideoTrimmerRoute
  toolsWordCounterRoute: typeof toolsWordCounterRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  toolsColorPickerRoute: toolsColorPickerRoute,
  toolsDiffCheckerRoute: toolsDiffCheckerRoute,
  toolsImageCompressorRoute: toolsImageCompressorRoute,
  toolsImageCropperRoute: toolsImageCropperRoute,
  toolsImagePaletteGeneratorRoute: toolsImagePaletteGeneratorRoute,
  toolsLoremIpsumRoute: toolsLoremIpsumRoute,
  toolsVideoTrimmerRoute: toolsVideoTrimmerRoute,
  toolsWordCounterRoute: toolsWordCounterRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/(tools)/color-picker",
        "/(tools)/diff-checker",
        "/(tools)/image-compressor",
        "/(tools)/image-cropper",
        "/(tools)/image-palette-generator",
        "/(tools)/lorem-ipsum",
        "/(tools)/video-trimmer",
        "/(tools)/word-counter"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/(tools)/color-picker": {
      "filePath": "(tools)/color-picker.tsx"
    },
    "/(tools)/diff-checker": {
      "filePath": "(tools)/diff-checker.tsx"
    },
    "/(tools)/image-compressor": {
      "filePath": "(tools)/image-compressor.tsx"
    },
    "/(tools)/image-cropper": {
      "filePath": "(tools)/image-cropper.tsx"
    },
    "/(tools)/image-palette-generator": {
      "filePath": "(tools)/image-palette-generator.tsx"
    },
    "/(tools)/lorem-ipsum": {
      "filePath": "(tools)/lorem-ipsum.tsx"
    },
    "/(tools)/video-trimmer": {
      "filePath": "(tools)/video-trimmer.tsx"
    },
    "/(tools)/word-counter": {
      "filePath": "(tools)/word-counter.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
