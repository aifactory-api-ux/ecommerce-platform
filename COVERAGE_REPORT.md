# Reporte de Cobertura de Pruebas
Fecha: 2026-05-06 | Proyecto: ecommerce | Modo: TDD

## 1. Resumen Ejecutivo
| Capa | Framework | Estado | Cobertura | Tests Pasados | Tests Fallidos |
|------|-----------|--------|-----------|---------------|----------------|
| Backend | pytest | FAIL | 0% | 0 | 0 (errores de import) |
| Frontend | vitest | FAIL | N/A (v8) | 83 | 6 |

**Evaluación general:** El backend presenta errores de import que impiden la ejecución de tests. El frontend tiene 6 tests fallidos sobre 89 ejecutados, relacionados con tests de index.html/main.jsx que verifican el DOM del documento completo y un hook useOrders con problemas de estado.

## 2. KPIs de Calidad
| Indicador | Valor | Umbral | Estado |
|-----------|-------|--------|--------|
| Cobertura global (promedio) | 0% | ≥90% | FAIL |
| Tests totales ejecutados | 89 | - | - |
| Tests fallidos | 6 | 0 | FAIL |
| Capas sin cobertura | 1 (Backend) | 0 | FAIL |

## 3. Detalle por Capa — Backend
No disponible — errores de import en todos los tests:

| Archivo | %Stmts | %Branch | %Funcs | %Lines | Sin cubrir |
|---------|--------|---------|--------|--------|------------|
| backend/product_service/*.py | N/A | N/A | N/A | N/A | 100% (no se ejecutó) |

**Error principal:** `ModuleNotFoundError: No module named 'backend'` — los tests usan imports absolutos desde `backend.` pero el módulo no está instalado ni disponible en PYTHONPATH.

## 4. Detalle por Capa — Frontend
Cobertura v8 no genera tabla textual en stdout. Archivos JSON de cobertura disponibles en `coverage/.tmp/` pero no procesables manualmente.

| Archivo | %Stmts | %Branch | %Funcs | %Lines | Sin cubrir |
|---------|--------|---------|--------|--------|------------|
| src/hooks/useOrders.js | N/A | N/A | N/A | N/A | ~20% (2 tests fallidos) |
| src/main.jsx | N/A | N/A | N/A | N/A | ~100% (1 test fallido) |
| index.html | N/A | N/A | N/A | N/A | ~100% (3 tests fallidos) |

## 5. Tests Fallidos
| Test | Capa | Error | Prioridad |
|------|------|-------|-----------|
| tests/index.test.jsx > renders root div with id root | Frontend | `expected null to be truthy` — document.getElementById('root') retorna null en jsdom | ALTA |
| tests/index.test.jsx > includes Vite script injection | Frontend | `expected 0 to be greater than 0` — no hay scripts de modulo en jsdom | ALTA |
| tests/index.test.jsx > sets correct meta charset and viewport | Frontend | `expected null to be truthy` — meta tags no existen en jsdom | ALTA |
| tests/main.test.jsx > renders App component into root div | Frontend | `expected null to be truthy` — root div no existe | ALTA |
| tests/hooks/useOrders.test.jsx > updates_order_status_and_reflects_in_orders_state | Frontend | `expected undefined to be 'shipped'` — estado no actualizado correctamente | MEDIA |
| tests/hooks/useOrders.test.jsx > handles_loading_state_during_fetch_orders | Frontend | `expected false to be true` — loading no cambia a true durante fetch | MEDIA |

Backend: 7 errores de import, 0 tests ejecutados.

## 6. Líneas Sin Cubrir (top 10 por impacto)
| Archivo | Líneas | Motivo probable |
|---------|--------|-----------------|
| backend/product_service/*.py | Todas | Tests no pueden ejecutarse por imports |
| src/hooks/useOrders.js | ~20% | 2 tests fallidos de 10 |
| src/main.jsx | ~100% | Test espera documento HTML completo |
| index.html | ~100% | Test espera meta tags y scripts de Vite |

## 7. Análisis de Calidad
### Fortalezas
- Frontend: 83 de 89 tests pasando (93.3% de éxito)
- Backend: Estructura de tests existe, solo falla en imports
- Tests de componentes React bien estructurados y pasando

### Áreas de Mejora
- Backend: Los imports `from backend.product_service...` requieren que el paquete esté instalado o PYTHONPATH configurado
- Frontend: Tests de index.html y main.jsx asumen ambiente de navegador real, no jsdom
- Hook useOrders: No actualiza correctamente el estado de orders ni el flag loading

## 8. Recomendaciones (priorizadas)
1. **ALTA:** Configurar PYTHONPATH o instalar backend como paquete para resolver `ModuleNotFoundError: No module named 'backend'`
2. **ALTA:** Los tests de index.html/main.jsx deben usar setup() de vitest para simular document.body correctamente
3. **MEDIA:** Verificar implementación de useOrders hook — loading state y actualización de orders no funcionan como esperado
4. **BAJA:** Instalar dependencias faltantes (sqlalchemy, jwt, etc.) para backend

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

==================================== ERRORS ====================================
_____________________ ERROR collecting tests/test_crud.py ______________________
ImportError while importing test module '/workspace/f3c9d1e7-2a8b-4f05-b674-cc1234567890/backend/tests/test_crud.py'.
Hint: make sure your test modules/packages have valid Python names.
Traceback:
/usr/local/lib/python3.11/importlib/__init__.py:126: in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
tests/test_crud.py:2: in <module>
    from backend.product_service.crud import create_product, update_product, delete_product, ProductNotFoundError
E   ModuleNotFoundError: No module named 'backend'
_____________________ ERROR collecting tests/test_db.py _______________________
ImportError while importing test module '/workspace/f3c9d1e7-2a8b-4f05-b674-cc1234567890/backend/tests/test_db.py'.
Hint: make sure your test modules/packages have valid Python names.
Traceback:
/usr/local/lib/python3.11/importlib/__init__.py:126: in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
tests/test_db.py:2: in <module>
    from sqlalchemy import create_engine
E   ModuleNotFoundError: No module named 'sqlalchemy'
_________________ ERROR collecting tests/test_dependencies.py __________________
/usr/local/lib/python3.11/site-packages/_pytest/python.py:493: in importtestmodule
    mod = import_path(
/usr/local/lib/python3.11/site_packages/_pytest/pathlib.py:582: in import_path
    importlib.import_module(module_name)
/usr/local/lib/python3.11/importlib/__init__.py:126: in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
<frozen importlib._bootstrap>:1204: in _gcd_import
???
<frozen importlib._bootstrap>:1176: in _find_and_load_unlocked
???
<frozen importlib._bootstrap>:690: in _load_unlocked
???
/usr/local/lib/python3.11/site-packages/_pytest/assertion/rewrite.py:165: in exec_module
    source_stat, co = _rewrite_test(fn, self.config)
/usr/local/lib/python3.11/site-packages/_pytest/assertion/rewrite.py:345: in exec_module
    tree = ast.parse(source, filename=strfn)
E     File "/workspace/f3c9d1e7-2a8b-4f05-b674-cc1234567890/backend/tests/test_dependencies.py", line 3
E       from backend.product-service.dependencies import require_role, get_current_user
E                           ^
E   SyntaxError: invalid syntax
___________________ ERROR collecting tests/test_jwt_utils.py ___________________
ImportError while importing test module '/workspace/f3c9d1e7-2a8b-4f05-b674-cc1234567890/backend/tests/test_jwt_utils.py'.
Hint: make sure your test modules/packages have valid Python names.
Traceback:
/usr/local/lib/python3.11/importlib/__init__.py:126: in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
tests/test_jwt_utils.py:2: in <module>
    import jwt
E   ModuleNotFoundError: No module named 'jwt'
_____________________ ERROR collecting tests/test_main.py ______________________
ImportError while importing test module '/workspace/f3c9d1e7-2a8b-4f05-b674-cc1234567890/backend/tests/test_main.py'.
Hint: make sure your test modules/packages have valid Python names.
Traceback:
/usr/local/lib/python3.11/importlib/__init__.py:126: in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
tests/test_main.py:3: in <module>
    from backend.product_service.main import app
E   ModuleNotFoundError: No module named 'backend'
____________________ ERROR collecting tests/test_models.py _____________________
ImportError while importing test module '/workspace/f3c9d1e7-2a8b-4f05-b674-cc1234567890/backend/tests/test_models.py'.
Hint: make sure your test modules/packages have valid Python names.
Traceback:
/usr/local/lib/python3.11/importlib/__init__.py:126: in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
tests/test_models.py:3: in <module>
    from backend.product_service.models import ProductCreateRequest
E   ModuleNotFoundError: No module named 'backend'
____________________ ERROR collecting tests/test_routes.py _____________________
ImportError while importing test module '/workspace/f3c9d1e7-2a8b-4f05-b674-cc1234567890/backend/tests/test_routes.py'.
Hint: make sure your test modules/packages have valid Python names.
Traceback:
/usr/local/lib/python3.11/importlib/__init__.py:126: in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
tests/test_routes.py:3: in <module>
    from backend.product_service.main import app
E   ModuleNotFoundError: No module named 'backend'
=============================== warnings summary ===============================
../../../usr/local/lib/python3.11/site-packages/starlette/formparsers.py:12
  /usr/local/lib/python3.11/site-packages/starlette/formparsers.py:12: PendingDeprecationWarning: Please use `import python_multipart` instead.
    import multipart

-- Docs: https://docs.pytest.org/en/latest/capture-warnings.html
=========================== short test summary info ============================
ERROR tests/test_crud.py
ERROR tests/test_db.py
ERROR tests/test_dependencies.py
ERROR tests/test_jwt_utils.py
ERROR tests/test_main.py
ERROR tests/test_models.py
ERROR tests/test_routes.py
!!!!!!!!!!!!!!!!!!! Interrupted: 7 errors during collection !!!!!!!!!!!!!!!!!!!!
1 warning, 7 errors in 2.17s
```

### Frontend
```
 RUN  v1.3.1 /workspace/f3c9d1e7-2a8b-4f05-b674-cc1234567890/frontend
      Coverage enabled with v8

 ❯ tests/hooks/useOrders.test.jsx  (10 tests | 2 failed) 75ms
   ❯ tests/hooks/useOrders.test.jsx > useOrders hook > updates_order_status_and_reflects_in_orders_state
     → expected undefined to be 'shipped' // Object.is equality
   ❯ tests/hooks/useOrders.test.jsx > useOrders hook > handles_loading_state_during_fetch_orders
     → expected false to be true // Object.is equality
 ✓ tests/pages/AdminDashboard.test.jsx  (9 tests) 10ms
 ✓ tests/pages/OrderDetail.test.jsx  (7 tests) 9ms
 ❯ tests/index.test.jsx  (3 tests | 3 failed) 34ms
   ❯ tests/index.test.jsx > index.html > renders root div with id root
     → expected null to be truthy
   ❯ tests/index.test.jsx > index.html > includes Vite script injection
     → expected 0 to be greater than 0
   ❯ tests/index.test.jsx > index.html > sets correct meta charset and viewport
     → expected null to be truthy
 ❯ tests/main.test.jsx  (3 tests | 1 failed) 15ms
   ❯ tests/main.test.jsx > main.jsx > renders App component into root div
     → expected null to be truthy
 ✓ tests/router.test.jsx  (3 tests) 7ms
 ✓ tests/components/Auth/RegisterForm.test.jsx  (3 tests) 6ms
 ✓ tests/components/Auth/LoginForm.test.jsx  (3 tests) 5ms
 ✓ tests/pages/ProductEdit.test.jsx  (3 tests) 4ms
 ✓ tests/components/Layout/Header.test.jsx  (3 tests) 30ms
 ✓ tests/components/Product/ProductList.test.jsx  (3 tests) 4ms
 ✓ tests/pages/Register.test.jsx  (3 tests) 4ms
 ✓ tests/pages/Products.test.jsx  (3 tests) 6ms
 ✓ tests/components/Product/ProductForm.test.jsx  (3 tests) 6ms
 ✓ tests/pages/Login.test.jsx  (3 tests) 6ms
 ✓ tests/components/Auth/UserMenu.test.jsx  (3 tests) 6ms
 ✓ tests/pages/Orders.test.jsx  (3 tests) 5ms
 ✓ tests/components/Order/OrderList.test.jsx  (3 tests) 5ms
 ✓ tests/components/Order/OrderForm.test.jsx  (3 tests) 5ms
 ✓ tests/components/Product/ProductDetail.test.jsx  (3 tests) 5ms
 ✓ tests/pages/Home.test.jsx  (3 tests) 7ms
 ✓ tests/App.test.jsx  (3 tests) 6ms
 ✓ tests/components/Order/OrderDetail.test.jsx  (3 tests) 5ms
 ✓ tests/components/Layout/Footer.test.jsx  (3 tests) 7ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 6 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/index.test.jsx > index.html > renders root div with id root
AssertionError: expected null to be truthy

- Expected:
null

+ Received:
false

 ❯ tests/index.test.jsx:6:18
      4|   it('renders root div with id root', () => {
      5|     const root = document.getElementById('root');
      6|     expect(root).toBeTruthy();
       |                  ^
      7|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯

 FAIL  tests/index.test.jsx > index.html > includes Vite script injection
AssertionError: expected 0 to be greater than 0
 ❯ tests/index.test.jsx:11:28
      9|   it('includes Vite script injection', () => {
     10|     const scripts = document.querySelectorAll("script[type='module']");
     11|     expect(scripts.length).toBeGreaterThan(0);
       |                            ^
     12|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯

 FAIL  tests/index.test.jsx > index.html > sets correct meta charset and viewport
AssertionError: expected null to be truthy

- Expected:
null

+ Received:
false

 ❯ tests/index.test.jsx:17:25
     15|     const metaCharset = document.querySelector("meta[charset='UTF-8']"…
     16|     const metaViewport = document.querySelector("meta[name='viewport']…
     17|     expect(metaCharset).toBeTruthy();
       |                         ^
     18|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯

 FAIL  tests/main.test.jsx > main.jsx > renders App component into root div
AssertionError: expected null to be truthy

- Expected:
null

+ Received:
false

 ❯ tests/main.test.jsx:6:18
      4|   it('renders App component into root div', () => {
      5|     const root = document.getElementById('root');
      6|     expect(root).toBeTruthy();
       |                  ^
      7|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯

 FAIL  tests/hooks/useOrders.test.jsx > useOrders hook > updates_order_status_and_reflects_in_orders_state
AssertionError: expected undefined to be 'shipped' // Object.is equality

- Expected:
"shipped"

+ Received:
undefined

 ❯ tests/hooks/useOrders.test.jsx:113:65
    111|     });
    112|
    113|     expect(result.current.orders.find(o => o.id === 1)?.status).toBe('…
       |                                                                 ^
    114|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/6]⎯

 FAIL  tests/hooks/useOrders.test.jsx > useOrders hook > handles_loading_state_during_fetch_orders
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ tests/hooks/useOrders.test.jsx:134:38
    132|     const fetchPromise = act(async () => {
    133|       const promise = result.current.fetchOrders();
    134|       expect(result.current.loading).toBe(true);
       |                                      ^
    135|       await promise;
    136|     });
 ❯ node_modules/@testing-library/react/dist/act-compat.js:47:24
 ❯ act node_modules/react/cjs/react.development.js:2512:16
 ❯ Proxy.<anonymous> node_modules/@testing-library/react/dist/act-compat.js:46:25
 ❯ tests/hooks/useOrders.test.jsx:132:26

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 6 ⎯⎯⎯⎯⎯⎯⎯

 Test Files  3 failed | 21 passed (24)
      Tests  6 failed | 83 passed (89)
   Start at  00:41:42
   Duration  33.31s (transform 376ms, setup 4ms, collect 1.18s, tests 272ms, environment 19.36s, prepare 4.10s)
```

## 10. Metadata
| Campo | Valor |
|-------|-------|
| Generado | 2026-05-06 00:45 UTC |
| Modo | TDD (tests escritos antes del código) |
| Umbral configurado | ≥90% |
| Herramientas | pytest / vitest v1.3.1 |