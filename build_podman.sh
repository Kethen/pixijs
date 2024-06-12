PODMAN_IMAGE_TAG="pixi_webpack4_builder"
CONTAINER_DEFINITION=Dockerfile

set -xe

if podman image exists $PODMAN_IMAGE_TAG && [ "$REBUULD_IMAGE" == "true" ]
then
    podman image rm $PODMAN_IMAGE_TAG
fi

if ! podman image exists $PODMAN_IMAGE_TAG
then
    podman image build -t $PODMAN_IMAGE_TAG -f $CONTAINER_DEFINITION
fi

podman run \
    --rm -it \
    --entrypoint /bin/bash \
    --security-opt label=disable \
    -v ./:/workdir \
    -w /workdir \
    $PODMAN_IMAGE_TAG \
    -c '
        npm install
        npm run build
    '
