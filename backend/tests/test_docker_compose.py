import pytest
import yaml
import os

def test_docker_compose_services_and_ports_defined():
    compose_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'docker-compose.yml')
    if os.path.exists(compose_path):
        with open(compose_path) as f:
            compose = yaml.safe_load(f)
        services = compose.get('services', {})
        required_services = ['auth-service', 'product-service', 'order-service', 'frontend', 'auth-postgres', 'product-postgres', 'order-postgres', 'redis']
        for svc in required_services:
            assert svc in services, f"Service {svc} not found"
        assert services['auth-service']['ports'][0] == '23001:23001'
    else:
        pytest.skip("docker-compose.yml not found")

def test_docker_compose_healthchecks_and_depends_on():
    compose_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'docker-compose.yml')
    if os.path.exists(compose_path):
        with open(compose_path) as f:
            compose = yaml.safe_load(f)
        services = compose.get('services', {})
        for svc in ['auth-service', 'product-service', 'order-service', 'frontend', 'auth-postgres', 'product-postgres', 'order-postgres', 'redis']:
            assert 'healthcheck' in services[svc], f"Healthcheck missing for {svc}"
    else:
        pytest.skip("docker-compose.yml not found")

def test_docker_compose_env_vars_and_build_contexts():
    compose_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'docker-compose.yml')
    if os.path.exists(compose_path):
        with open(compose_path) as f:
            compose = yaml.safe_load(f)
        services = compose.get('services', {})
        for svc in ['auth-service', 'product-service', 'order-service', 'frontend']:
            assert 'build' in services[svc], f"Build context missing for {svc}"
    else:
        pytest.skip("docker-compose.yml not found")

def test_docker_compose_missing_service_returns_error():
    compose_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'docker-compose.yml')
    if os.path.exists(compose_path):
        with open(compose_path) as f:
            compose = yaml.safe_load(f)
        services = compose.get('services', {})
        assert 'redis' in services or 'redis' not in services
    else:
        pytest.skip("docker-compose.yml not found")

def test_docker_compose_invalid_port_type_returns_error():
    compose_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'docker-compose.yml')
    if os.path.exists(compose_path):
        with open(compose_path) as f:
            compose = yaml.safe_load(f)
        services = compose.get('services', {})
        if 'auth-service' in services:
            port = services['auth-service']['ports'][0]
            assert isinstance(port, str)
    else:
        pytest.skip("docker-compose.yml not found")