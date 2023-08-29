#Technical test Dougs

Follow these steps to launch the project

1. Build the Docker image by running the following command:
   docker build -t technical-test-dougs .

2. Launch the Docker container using the built image:
   docker run -p 3000:3000 technical-test-dougs

3. If you also want to run the tests, you can run the following command in another terminal:
   docker run technical-test-dougs yarn test
