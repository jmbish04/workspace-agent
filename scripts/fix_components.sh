# Fix CompareDocs.tsx missing types
sed -i 's/const data = await response.json();/const data: any = await response.json();/' src/components/CompareDocs.tsx
