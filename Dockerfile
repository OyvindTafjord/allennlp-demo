# This Dockerfile is used to serve the AllenNLP demo.

FROM python:3.7.2
LABEL maintainer="oyvindt@allenai.org"

WORKDIR /stage/aristo-demos

# Install npm early so layer is cached when mucking with the demo
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - && apt-get install -y nodejs

# Install python dependencies, including some big ones from AllenNLP
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN pip install git+https://github.com/OyvindTafjord/allennlp.git@889cc3021be475b3568b57229f1fc13f94ae74b7#egg=allennlp

# Download spacy model
RUN spacy download en_core_web_sm

COPY scripts/ scripts/
COPY server/models.py server/models.py

# Now install and build the demo
COPY demo/ demo/
RUN ./scripts/build_demo.py

COPY app.py app.py
COPY server/ server/

# Copy the configuration files used at runtime
COPY models.json models.json

# Optional argument to set an environment variable with the Git SHA
ARG SOURCE_COMMIT
ENV ALLENNLP_DEMO_SOURCE_COMMIT $SOURCE_COMMIT

EXPOSE 8000

ENTRYPOINT ["./app.py"]
CMD ["--demo-dir", "/stage/aristo-demos/demo"]
