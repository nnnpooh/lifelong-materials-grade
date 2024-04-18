# Problem
- Some of the picocss variable not get exported when build, making the style somewhat broken.

# Attemp
- Use tailwind prefix.
- Change from `import @picocss/pico` to `import @picocss/pico/css/pico.min.css` in both layout.tsx and page.tsx
- Remove all tailwind class usage.
