#!/usr/bin/env bash
set -e

BASE="./source-material/python"

sessions=(
  "1|W01_Workshop_Variables_and_Assignment.pdf"
  "2|W02_Workshop_Booleans_Conditionals_Loops.pdf"
  "3|W03_Workshop_Strings_Lists_Loops.pdf"
  "4|W04_Workshop_Functions_and_Scoping.pdf"
  "5|W05_Workshop_Mutable_Immutable_Objects.pdf"
  "6|W06_Workshop_File_IO.pdf"
  "7|W07_Workshop_Modules_and_Packages.pdf"
  "8|W08_Workshop_OOP_Classes.pdf"
  "9|W09_Workshop_OOP_Inheritance.pdf"
  "10|W10_Workshop_Assertions_Exceptions_Testing.pdf"
  "11|W11_Workshop_Recursion.pdf"
  "12|W12_Workshop_Lambda_Map_Filter_Comprehensions.pdf"
)

for entry in "${sessions[@]}"; do
  session="${entry%%|*}"
  file="${entry##*|}"
  echo ""
  echo "════════════════════════════════════════"
  echo " Session $session — $file"
  echo "════════════════════════════════════════"
  npm run seed -- --pdf "$BASE/$file" --subject python --session "$session"
done

echo ""
echo "✅ All 12 Python sessions seeded."
