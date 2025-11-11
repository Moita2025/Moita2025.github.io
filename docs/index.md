---
hide:
  - navigation
---

# Welcome to MkDocs

For full documentation visit [mkdocs.org](https://www.mkdocs.org).

## Commands

* `mkdocs new [dir-name]` - Create a new project.
* `mkdocs serve` - Start the live-reloading docs server.
* `mkdocs build` - Build the documentation site.
* `mkdocs -h` - Print help message and exit.

## Rough Notation 测试

<span class="rn-e1">测试文字</span>

<span class="rn-e2">测试文字</span>

<span class="rn-e3">测试文字</span>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (!window.RoughNotation) return;
    const { annotate, annotationGroup } = window.RoughNotation;

    const a1 = annotate(document.querySelector('.rn-e1'), { type: 'underline' });
    const a2 = annotate(document.querySelector('.rn-e2'), { type: 'box' });
    const a3 = annotate(document.querySelector('.rn-e3'), { type: 'circle' });

    const ag = annotationGroup([a1, a2, a3]);
    ag.show();
  });
</script>
