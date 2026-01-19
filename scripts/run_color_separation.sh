#!/bin/bash
cd /Users/iorikawano/Documents/Ukiyoe
source .venv/bin/activate

echo "Processing benizuri-e.png..."
python scripts/color_layer_separation.py -n 10 public/images/benizuri-e.png -o public/images/dawn/benizuri-e 2>&1

echo ""
echo "Processing nishiki-e.png..."
python scripts/color_layer_separation.py -n 10 public/images/nishiki-e.png -o public/images/dawn/nishiki-e 2>&1

echo ""
echo "Done!"

