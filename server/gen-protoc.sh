# Path to this plugin
PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"

TMP_DIR="./tmp"
OUT_DIR="./src/generated"
IN_DIR="./src/proto"

mkdir ${TMP_DIR}

for protofile in ${IN_DIR}/*; do
  echo "generate code for ${protofile} \n"
  protoc \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --ts_out="${TMP_DIR}" \
    ${protofile}
done

mv ${TMP_DIR}/${IN_DIR}/* ${OUT_DIR}
rm -r ${TMP_DIR}