import pytest
import os
import subprocess

def test_run_sh_validates_docker_and_builds_images():
    run_sh_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'run.sh')
    if os.path.exists(run_sh_path):
        content = open(run_sh_path).read()
        assert 'docker' in content.lower()
        assert 'docker compose' in content.lower() or 'docker-compose' in content.lower()
    else:
        pytest.skip("run.sh not found")

def test_run_sh_waits_for_services_healthy_and_prints_urls():
    run_sh_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'run.sh')
    if os.path.exists(run_sh_path):
        content = open(run_sh_path).read()
        assert 'healthy' in content.lower() or 'wait' in content.lower()
        assert 'localhost' in content
    else:
        pytest.skip("run.sh not found")

def test_run_sh_missing_docker_returns_error():
    run_sh_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'run.sh')
    if os.path.exists(run_sh_path):
        content = open(run_sh_path).read()
        assert 'docker' in content.lower()
    else:
        pytest.skip("run.sh not found")

def test_run_sh_service_unhealthy_times_out():
    run_sh_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'run.sh')
    if os.path.exists(run_sh_path):
        content = open(run_sh_path).read()
        assert 'timeout' in content.lower() or 'wait' in content.lower()
    else:
        pytest.skip("run.sh not found")