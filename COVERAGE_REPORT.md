# Reporte de Cobertura de Pruebas
Fecha: 2026-05-05 | Proyecto: E-Commerce Platform | Modo: TDD

## 1. Resumen Ejecutivo
| Capa | Framework | Estado | Cobertura | Tests Pasados | Tests Fallidos |
|------|-----------|--------|-----------|---------------|----------------|
| Backend | pytest | FAIL | 0% | 0 | 3 (collection errors) |
| Frontend | vitest | FAIL | 0% | 0 | 25 (configuration errors) |

**Evaluación general:** Los tests no pueden ejecutarse debido a errores de configuración. El backend tiene dependencias faltantes (sqlalchemy, jwt, backend module path) y el frontend tiene configuración incorrecta de Babel/Jest para JSX y ESM.

## 2. KPIs de Calidad
| Indicador | Valor | Umbral | Estado |
|-----------|-------|--------|--------|
| Cobertura global (promedio) | 0% | ≥90% | FAIL |
| Tests totales ejecutados | 0 | - | - |
| Tests fallidos | 28 | 0 | FAIL |
| Capas sin cobertura | 2 | 0 | FAIL |

## 3. Detalle por Capa — Backend
No hay datos de cobertura disponibles debido a errores de collection en pytest.

| Archivo | %Stmts | %Branch | %Funcs | %Lines | Sin cubrir |
|---------|--------|---------|--------|--------|------------|

## 4. Detalle por Capa — Frontend
No hay datos de cobertura disponibles debido a errores de configuración en Jest.

| Archivo | %Stmts | %Branch | %Funcs | %Lines | Sin cubrir |
|---------|--------|---------|--------|--------|------------|

## 5. Tests Fallidos
| Test | Capa | Error | Prioridad |
|------|------|-------|-----------|
| test_db.py | Backend | ModuleNotFoundError: No module named 'sqlalchemy' | ALTA |
| test_models.py | Backend | ModuleNotFoundError: No module named 'backend' | ALTA |
| test_utils.py | Backend | ModuleNotFoundError: No module named 'jwt' | ALTA |
| tests/api/auth.test.jsx | Frontend | SyntaxError: Cannot use import statement outside a module | ALTA |
| tests/api/product.test.jsx | Frontend | SyntaxError: Cannot use import statement outside a module | ALTA |
| tests/api/order.test.jsx | Frontend | SyntaxError: Cannot use import statement outside a module | ALTA |
| tests/types/auth.test.tsx | Frontend | SyntaxError: Expected "from" (import pytest) | ALTA |
| tests/components/Product/ProductDetail.test.jsx | Frontend | Support for JSX isn't enabled | ALTA |
| tests/components/Order/OrderList.test.jsx | Frontend | Support for JSX isn't enabled | ALTA |
| tests/components/Product/ProductList.test.jsx | Frontend | Support for JSX isn't enabled | ALTA |
| tests/hooks/useOrders.test.jsx | Frontend | SyntaxError: Cannot use import statement | ALTA |
| tests/hooks/useAuth.test.jsx | Frontend | SyntaxError: Cannot use import statement | ALTA |
| tests/utils/storage.test.jsx | Frontend | SyntaxError: Cannot use import statement | ALTA |
| tests/routes/OrderRoutes.test.jsx | Frontend | Support for JSX isn't enabled | ALTA |
| tests/routes/ProductRoutes.test.jsx | Frontend | Support for JSX isn't enabled | ALTA |
| tests/App.test.jsx | Frontend | Support for JSX isn't enabled | ALTA |
| tests/index.test.jsx | Frontend | SyntaxError: Cannot use import statement | ALTA |
| tests/vite.config.test.jsx | Frontend | SyntaxError: Cannot use import statement | ALTA |

## 6. Líneas Sin Cubrir (top 10 por impacto)
No aplicable — los tests no se ejecutaron correctamente.

| Archivo | Líneas | Motivo probable |
|---------|--------|-----------------|

## 7. Análisis de Calidad
### Fortalezas
- El proyecto cuenta con una estructura de tests definida
- Se generaron scripts run_tests.sh para automatizar la ejecución de pruebas

### Áreas de Mejora
- **Backend:** Instalar dependencias faltantes (sqlalchemy, jwt, pyjwt) y corregir el path del módulo 'backend'
- **Frontend:** Configurar Jest/Babel correctamente para soportar JSX y ESM imports
- Los archivos de test tienen configuración incorrecta que impide su ejecución

## 8. Recomendaciones (priorizadas)
1. **ALTA:** Corregir la configuración del frontend para soportar JSX y ESM - añadir @babel/preset-react y @babel/preset-env a la configuración de Jest
2. **ALTA:** Instalar las dependencias Python faltantes en el backend: sqlalchemy, jwt, pyjwt
3. **ALTA:** Corregir el path de importación del módulo 'backend' en test_models.py (debería usar rutas relativas o instalar el paquete en editable)
4. **MEDIA:** Verificar que vitest esté configurado correctamente en lugar de Jest para el proyecto frontend
5. **BAJA:** Los tests de types/auth.test.tsx contienen código Python (pytest) en lugar de JavaScript - deben reescribirse

## 9. Output Completo de Tests
### Backend
```
=== Ejecutando: ./backend/run_tests.sh ===
  WARNING: The scripts coverage, coverage-3.11 and coverage3 are installed in '/home/appuser/.local/bin' which is not on PATH.
  Consider adding this directory to PATH or, if you prefer to suppress this warning, use --no-warn-script-location.

[notice] A new release of pip is available: 24.0 -> 26.1.1
[notice] To update, run: pip install --upgrade pip
/usr/local/lib/python3.11/site-packages/pytest_asyncio/plugin.py:208: PytestDeprecationWarning: The configuration option "asyncio_default_fixture_loop_scope" is unset.
The event loop scope for asynchronous fixtures will default to the fixture caching scope. Future versions of pytest-asyncio will default the loop scope for asynchronous fixtures to function scope. Set the default fixture loop scope explicitly in order to avoid unexpected behavior in the future. Valid fixture loop scopes are: "function", "class", "module", "package", "session"

  warnings.warn(PytestDeprecationWarning(_DEFAULT_FIXTURE_LOOP_SCOPE_UNSET))

=================================== ERRORS ====================================
______________________ ERROR collecting tests/test_db.py _______________________
ImportError while importing test module '/workspace/f3c9d1e7-2a8b-4f05-b674-cc1234567890/backend/tests/test_db.py'.
Hint: make sure your test modules/packages have valid Python names.
Traceback:
/usr/local/lib/python3.11/importlib/__init__.py:126: in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
tests/test_db.py:2: in <module>
    from sqlalchemy import create_engine
E   ModuleNotFoundError: No module named 'sqlalchemy'
____________________ ERROR collecting tests/test_models.py _____________________
ImportError while importing test module '/workspace/f3c9d1e7-2a8b-4f05-b674-cc1234567890/backend/tests/test_models.py'.
Hint: make sure your test modules/packages have valid Python names.
Traceback:
/usr/local/lib/python3.11/importlib/__init__.py:126: in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
tests/test_models.py:3: in <module>
    from backend.shared.models import ProductCreateRequest
E   ModuleNotFoundError: No module named 'backend'
_____________________ ERROR collecting tests/test_utils.py _____________________
ImportError while importing test module '/workspace/f3c9d1e7-2a8b-4f05-b674-cc1234567890/backend/tests/test_utils.py'.
Hint: make sure your test modules/packages have valid Python names.
Traceback:
/usr/local/lib/python3.11/importlib/__init__.py:126: in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
tests/test_utils.py:2: in <module>
    import jwt
E   ModuleNotFoundError: No module named 'jwt'
=========================== short test summary info ============================
ERROR tests/test_db.py
ERROR tests/test_models.py
ERROR tests/test_utils.py
!!!!!!!!!!!!!!!!!!! Interrupted: 3 errors during collection !!!!!!!!!!!!!!!!!!!!
3 errors in 0.44s
```

### Frontend
```
=== Ejecutando: ./frontend/run_tests.sh ===
npm WARN deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use a checked version of a library that handles concurrent requests.
npm WARN deprecated glob@7.2.3: Old versions of glob are not supported, and contain widely publicized security vulnerabilities.

added 309 packages, and audited 310 packages in 20s

40 packages are looking for funding
  Run `npm fund` for details

6 vulnerabilities (2 moderate, 4 high)

Run `npm audit` for details.

FAIL tests/api/auth.test.jsx
  ● Test suite failed to run

    Jest encountered an unexpected token
    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax

    Details:
    /workspace/f3c9d1e7-2a8b-4f05-b674-cc1234567890/frontend/tests/api/auth.test.jsx:9
    import { render } from '@testing-library/react';
    ^^^^^^
    SyntaxError: Cannot use import statement outside a module

FAIL tests/types/auth.test.tsx
  ● Test suite failed to run
    SyntaxError: /workspace/f3c9d1e7-2a8b-4f05-b674-cc1234567890/frontend/tests/types/auth.test.tsx: Unexpected token, expected "from" (3:0)
      1 | import pytest
      2 |
    > 3 | def test_UserRegisterRequest_interface_accepts_valid_fields():
        | ^

FAIL tests/components/Product/ProductDetail.test.jsx
  ● Test suite failed to run
    SyntaxError: .../frontend/tests/components/Product/ProductDetail.test.jsx: Support for the experimental syntax 'jsx' isn't currently enabled

(Test Suites: 25 failed, 25 total)
(Test Suites: 25 failed, 25 total)
Tests:       0 total
Snapshots:   0 total
Time:        3.662 s
Ran all test suites.
```

## 10. Metadata
| Campo | Valor |
|-------|-------|
| Generado | 2026-05-05 19:15 UTC |
| Modo | TDD (tests escritos antes del código) |
| Umbral configurado | ≥90% |
| Herramientas | pytest v8.3.4 / Jest v29.7.0 |