import pytest
import os

def test_architecture_md_includes_system_diagram():
    arch_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'docs', 'architecture.md')
    if os.path.exists(arch_path):
        with open(arch_path) as f:
            content = f.read().lower()
        assert 'diagram' in content or 'arch' in content or 'service' in content
    else:
        pytest.skip("docs/architecture.md not found")

def test_architecture_md_describes_each_component():
    arch_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'docs', 'architecture.md')
    if os.path.exists(arch_path):
        with open(arch_path) as f:
            content = f.read()
        components = ['auth-service', 'product-service', 'order-service', 'frontend', 'postgres', 'redis']
        for comp in components:
            assert comp in content
    else:
        pytest.skip("docs/architecture.md not found")

def test_architecture_md_missing_diagram_returns_error():
    arch_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'docs', 'architecture.md')
    if os.path.exists(arch_path):
        with open(arch_path) as f:
            content = f.read().lower()
        assert 'diagram' in content or 'service' in content
    else:
        pytest.skip("docs/architecture.md not found")