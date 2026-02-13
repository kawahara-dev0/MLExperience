# Base image: Python 3.12
FROM python:3.12-slim

WORKDIR /app

# System packages and build tools
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml ./

# Install uv (fast Python package manager)
RUN pip install --no-cache-dir uv

# Install dependencies
RUN uv pip install --system -e .

COPY . .

EXPOSE 5000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000", "--reload"]
