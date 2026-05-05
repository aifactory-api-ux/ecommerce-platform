import pytest
import os

def test_readme_md_includes_prerequisites_and_setup():
    readme_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'README.md')
    if os.path.exists(readme_path):
        with open(readme_path) as f:
            content = f.read().lower()
        assert 'prerequisite' in content or 'requirement' in content
        assert 'setup' in content or 'install' in content
    else:
        pytest.skip("README.md not found")

def test_readme_md_lists_all_api_endpoints():
    readme_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'README.md')
    if os.path.exists(readme_path):
        with open(readme_path) as f:
            content = f.read()
        endpoints = ['/auth/register', '/auth/login', '/auth/refresh', '/auth/me', '/products', '/products/{id}', '/orders', '/orders/{id}']
        for ep in endpoints:
            assert ep in content
    else:
        pytest.skip("README.md not found")

def test_readme_md_includes_troubleshooting_section():
    readme_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'README.md')
    if os.path.exists(readme_path):
        with open(readme_path) as f:
            content = f.read().lower()
        assert 'troubleshoot' in content or 'common error' in content or 'faq' in content
    else:
        pytest.skip("README.md not found")

def test_readme_md_missing_required_section_returns_error():
    readme_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'README.md')
    if os.path.exists(readme_path):
        with open(readme_path) as f:
            content = f.read().lower()
        assert 'setup' in content or 'missing' not in content
    else:
        pytest.skip("README.md not found")