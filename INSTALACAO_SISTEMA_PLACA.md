# 📋 Sistema de Consulta de Veículos por Placa - QuickMechanic

## ✅ SISTEMA COMPLETO IMPLEMENTADO

### 🎯 Funcionalidades Implementadas

1. **Busca Automática por Placa**
   - Usuário digita 7 caracteres (ex: AB12CDE)
   - Sistema busca automaticamente na API
   - Preenche todos os campos do veículo

2. **Salvamento de Orçamento**
   - Salva todos os dados do veículo + serviço + localização
   - Armazena no MongoDB para uso futuro
   - Retorna ID do orçamento

3. **Mensagens em Português (BR)**
   - Todas as mensagens e feedback em PT-BR
   - Interface adaptada para o mercado brasileiro

---

## 📁 Arquivos Criados/Modificados

### Backend (Python/FastAPI)

#### ✅ Arquivos Novos:

1. **`/app/backend/models.py`**
   - Modelos Pydantic para Vehicle e Quote
   - Validação de dados
   - Estrutura de resposta da API

2. **`/app/backend/vehicle_mock_db.py`**
   - Banco de dados mock com 20 veículos UK
   - Função `search_vehicle_by_plate()`
   - Dados em português (cores, combustível, etc.)

#### ✅ Arquivos Modificados:

3. **`/app/backend/server.py`**
   - Adicionado endpoint: `GET /api/vehicle/plate/:plate`
   - Adicionado endpoint: `POST /api/quotes`
   - Adicionado endpoint: `GET /api/quotes/:id`
   - Adicionado endpoint: `GET /api/quotes`

### Frontend (React)

#### ✅ Arquivos Novos:

4. **`/app/frontend/src/services/api.js`**
   - Serviço de integração com a API
   - Funções: searchVehicleByPlate(), createQuote()

#### ✅ Arquivos Modificados:

5. **`/app/frontend/src/pages/Home.jsx`**
   - Integração com API real
   - Auto-search ao completar 7 caracteres
   - Salvamento de orçamento ao submeter

---

## 🔌 Endpoints da API

### 1. Buscar Veículo por Placa

```bash
GET /api/vehicle/plate/{plate}
```

**Exemplo de Requisição:**
```bash
curl http://localhost:8001/api/vehicle/plate/AB12CDE
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "data": {
    "plate": "AB12 CDE",
    "make": "ford",
    "make_name": "Ford",
    "model": "Fiesta",
    "year": "2012",
    "color": "Azul",
    "fuel": "Gasolina",
    "version": "1.0 EcoBoost Titanium",
    "category": "Hatchback",
    "power": "125cv",
    "transmission": "Manual",
    "doors": "5",
    "engine_size": "998cc",
    "co2": "109g/km",
    "mpg": "60.1",
    "country": "UK"
  },
  "message": "Veículo encontrado com sucesso"
}
```

**Resposta de Placa Não Encontrada:**
```json
{
  "success": false,
  "data": null,
  "message": "Placa não encontrada em nossa base de dados"
}
```

### 2. Criar Orçamento

```bash
POST /api/quotes
Content-Type: application/json
```

**Exemplo de Requisição:**
```bash
curl -X POST http://localhost:8001/api/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "plate": "AB12CDE",
    "make": "ford",
    "model": "Fiesta",
    "year": "2012",
    "color": "Azul",
    "fuel": "Gasolina",
    "version": "1.0 EcoBoost Titanium",
    "category": "Hatchback",
    "service": "oil_change",
    "location": "London, UK",
    "description": "Preciso trocar o óleo"
  }'
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-gerado-automaticamente",
    "plate": "AB12CDE",
    "make": "ford",
    "model": "Fiesta",
    "year": "2012",
    "color": "Azul",
    "fuel": "Gasolina",
    "version": "1.0 EcoBoost Titanium",
    "category": "Hatchback",
    "service": "oil_change",
    "location": "London, UK",
    "description": "Preciso trocar o óleo",
    "estimated_price": null,
    "status": "pending",
    "created_at": "2025-07-10T10:30:00Z"
  },
  "message": "Orçamento salvo com sucesso"
}
```

### 3. Buscar Orçamento por ID

```bash
GET /api/quotes/{quote_id}
```

### 4. Listar Todos os Orçamentos

```bash
GET /api/quotes?limit=100
```

---

## 🗄️ Veículos Disponíveis no Mock

### Placas de Teste (UK):

| Placa | Marca | Modelo | Ano | Cor |
|-------|-------|--------|-----|-----|
| AB12CDE | Ford | Fiesta | 2012 | Azul |
| CD34FGH | Volkswagen | Golf | 2015 | Prata |
| EF56IJK | BMW | 3 Series | 2018 | Preto |
| GH67LMN | Audi | A4 | 2017 | Branco |
| IJ18OPQ | Mercedes-Benz | C-Class | 2018 | Cinza |
| KL20RST | Land Rover | Range Rover Sport | 2020 | Preto |
| MN22UVW | Nissan | Qashqai | 2022 | Vermelho |
| OP19XYZ | Vauxhall | Corsa | 2019 | Branco |
| QR21ABC | Mini | Cooper | 2021 | Verde |
| ST23DEF | Tesla | Model 3 | 2023 | Branco Pérola |

**Total:** 20 veículos cadastrados

---

## 🚀 Como Testar

### 1. Testar API Diretamente

```bash
# Buscar veículo
curl http://localhost:8001/api/vehicle/plate/AB12CDE | jq

# Criar orçamento
curl -X POST http://localhost:8001/api/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "plate": "AB12CDE",
    "make": "ford",
    "model": "Fiesta",
    "year": "2012",
    "service": "oil_change",
    "location": "London",
    "description": "Teste"
  }' | jq

# Listar orçamentos
curl http://localhost:8001/api/quotes | jq
```

### 2. Testar Interface

1. Acesse: http://localhost:3000
2. Role até a seção de orçamento
3. Digite uma placa (ex: AB12CDE)
4. Aguarde o sistema buscar automaticamente
5. Preencha serviço e localização
6. Clique em "Calcular Preço"
7. Verifique o toast de confirmação

---

## 🔧 Fluxo Completo

```
┌─────────────────┐
│ Usuário digita  │
│   placa (7)     │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ Frontend detecta    │
│ 7 caracteres        │
└────────┬────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Chama API:                  │
│ GET /api/vehicle/plate/XXX  │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Backend busca no mock   │
│ vehicle_mock_db.py      │
└────────┬────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐  ┌──────────┐
│Found  │  │Not Found │
└───┬───┘  └────┬─────┘
    │           │
    ▼           ▼
┌────────┐  ┌──────────────┐
│Preenche│  │Mostra erro + │
│campos  │  │permite manual│
└───┬────┘  └──────────────┘
    │
    ▼
┌─────────────────────┐
│ Usuário preenche    │
│ serviço + local     │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Submete formulário  │
└────────┬────────────┘
         │
         ▼
┌──────────────────────┐
│ Chama API:           │
│ POST /api/quotes     │
└────────┬─────────────┘
         │
         ▼
┌─────────────────────┐
│ Salva no MongoDB    │
│ Retorna ID          │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Navega para busca   │
│ de mecânicos        │
└─────────────────────┘
```

---

## ✨ Recursos Implementados

✅ Busca automática ao digitar 7 caracteres
✅ Validação de formato de placa UK
✅ Preenchimento automático de campos
✅ Salvamento de orçamento com todos os dados
✅ Mensagens de erro/sucesso em português
✅ Integração completa Frontend ↔ Backend
✅ Mock database com 20 veículos
✅ MongoDB para persistência
✅ Toast notifications
✅ Tratamento de erros

---

## 🎨 Campos do Veículo Retornados

- **Placa** (formatada com espaço)
- **Marca** (código + nome)
- **Modelo**
- **Ano**
- **Cor** (em português)
- **Combustível** (em português)
- **Versão** (trim completo)
- **Categoria** (tipo de carroceria)
- **Potência** (cv)
- **Transmissão** (Manual/Automático)
- **Portas**
- **Tamanho do Motor** (cc)
- **Emissões CO2** (g/km)
- **Consumo** (MPG)

---

## 📝 Próximos Passos (Opcional)

1. **Integrar API Real de Consulta de Placas**
   - Substituir `vehicle_mock_db.py` por API real
   - Exemplos: DVLA API (UK), Brasil API (BR)

2. **Adicionar Cálculo de Preço com IA**
   - Usar Emergent LLM para estimar preço
   - Baseado em serviço + veículo + localização

3. **Sistema de Autenticação**
   - Google OAuth (Emergent)
   - Salvar orçamentos por usuário

4. **Dashboard de Orçamentos**
   - Visualizar histórico
   - Editar/cancelar orçamentos

---

## 🐛 Troubleshooting

### Erro: "Placa não encontrada"
- Verifique se está usando uma das 20 placas mock
- Placas devem ter 7 caracteres (ex: AB12CDE)
- Sistema remove espaços e hífens automaticamente

### Erro ao salvar orçamento
- Verifique se MongoDB está rodando
- Confira logs: `tail -f /var/log/supervisor/backend.err.log`

### Frontend não encontra API
- Verifique REACT_APP_BACKEND_URL no .env
- Backend deve estar em http://localhost:8001

---

## 📞 Suporte

Sistema implementado e testado com sucesso!
Todos os endpoints funcionando ✅
MongoDB integrado ✅
Frontend conectado ✅

**Desenvolvido por:** E1 - Emergent AI
**Data:** Julho 2025
