# Tasks

## 1. Add FAQPage schema to useSEO call

- [x] 1.1 Build a FAQPage schema object from `t.faq.items` (mapping each to `@type: "Question"` with `acceptedAnswer`) and add it to the `schemas` array in the `useSEO()` call in LandingPage.tsx.

## 2. Verification

- [x] 2.1 Check that the JSON-LD script tag with `@type: "FAQPage"` is present in the page's `<head>` using browser dev tools or javascript_tool.
