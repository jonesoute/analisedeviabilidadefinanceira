// Sistema de Análise de Viabilidade Financeira - Estética Corporal
// Versão completa com 5 abas e todas as melhorias solicitadas - CORRIGIDA

class FinancialAnalysisApp {
    constructor() {
        this.state = {
            servicos: [],
            produtos: [], // Produtos para VENDA
            materiais: [],
            equipamentos: [],
            funcionarios: [],
            socios: [],
            despesasFixas: [],
            despesasVariaveis: [],
            consumoMateriais: [], // Materiais usados por serviço
            produtosPorServico: [], // Produtos consumidos por serviço
            parametrosAtendimento: {
                horasUteisPorDia: 10,
                diasUteisPorMes: 22,
                taxaOcupacao: 75
            },
            parametrosProjecao: {
                mesesProjecao: 24,
                crescimentoReceita: 2.5,
                crescimentoCustos: 1.5,
                investimentoMarketing: 1000
            }
        };
        
        this.charts = {};
        this.calculosServicos = [];
        this.calculosProdutos = [];
        this.projecaoData = [];
        this.currentSection = 'dashboard';
        this.paginaProjecaoAtual = 0;
        this.mesesPorPagina = 12;
    }

    init() {
        console.log('Iniciando aplicação...');
        this.loadInitialData();
        this.loadFromStorage();
        this.setupNavigation();
        this.renderAll();
        this.setupEventListeners();
        this.calculate();
        console.log('Aplicação iniciada com sucesso');
    }

    loadInitialData() {
        // Dados iniciais dos exemplos
        this.state.servicos = [
            {id: 1, codigo: "MASS01", nome: "Massagem Modeladora", duracao: 60, categoria: "Corporal", margemDesejada: 45},
            {id: 2, codigo: "DREN01", nome: "Drenagem Linfática", duracao: 90, categoria: "Corporal", margemDesejada: 50},
            {id: 3, codigo: "LIPO01", nome: "Lipocavitação", duracao: 45, categoria: "Estética Avançada", margemDesejada: 55},
            {id: 4, codigo: "RADIO01", nome: "Radiofrequência", duracao: 30, categoria: "Estética Avançada", margemDesejada: 60},
            {id: 5, codigo: "CRIO01", nome: "Criolipólise", duracao: 120, categoria: "Estética Avançada", margemDesejada: 65}
        ];

        this.state.produtos = [
            {id: 1, codigo: "PROD01", nome: "Creme Anti-Celulite", custoProduto: 45.00, margemDesejada: 150, categoria: "Cosméticos"},
            {id: 2, codigo: "PROD02", nome: "Óleo Corporal Premium", custoProduto: 28.00, margemDesejada: 180, categoria: "Cosméticos"},
            {id: 3, codigo: "PROD03", nome: "Suplemento Drenante", custoProduto: 35.00, margemDesejada: 120, categoria: "Suplementos"},
            {id: 4, codigo: "PROD04", nome: "Kit Cuidados Pós-Tratamento", custoProduto: 85.00, margemDesejada: 100, categoria: "Kits"}
        ];

        this.state.materiais = [
            {id: 1, codigo: "CREM01", nome: "Creme Redutor", custoUnitario: 2.50, rendimento: 20, unidade: "ml"},
            {id: 2, codigo: "OLEO01", nome: "Óleo de Massagem", custoUnitario: 1.80, rendimento: 30, unidade: "ml"},
            {id: 3, codigo: "LUVA01", nome: "Luvas Descartáveis", custoUnitario: 0.15, rendimento: 2, unidade: "par"},
            {id: 4, codigo: "GAZE01", nome: "Gaze Estéril", custoUnitario: 0.25, rendimento: 5, unidade: "unid"},
            {id: 5, codigo: "GEL01", nome: "Gel Condutor", custoUnitario: 3.20, rendimento: 15, unidade: "ml"}
        ];

        this.state.equipamentos = [
            {id: 1, codigo: "MACA01", nome: "Maca Estética", custoAquisicao: 2500.00, vidaUtil: 60, custoHora: 0.69},
            {id: 2, codigo: "ULTRA01", nome: "Ultrassom Estético", custoAquisicao: 8500.00, vidaUtil: 36, custoHora: 3.94},
            {id: 3, codigo: "RADIO01", nome: "Radiofrequência", custoAquisicao: 12000.00, vidaUtil: 48, custoHora: 4.17},
            {id: 4, codigo: "CRIO01", nome: "Equipamento Criolipólise", custoAquisicao: 35000.00, vidaUtil: 60, custoHora: 9.72}
        ];

        this.state.funcionarios = [
            {id: 1, nome: "Esteticista Pleno", cargo: "Profissional de Estética", salario: 2500.00},
            {id: 2, nome: "Esteticista Sênior", cargo: "Coordenador de Estética", salario: 3200.00},
            {id: 3, nome: "Recepcionista", cargo: "Atendimento", salario: 1400.00}
        ];

        this.state.socios = [
            {id: 1, nome: "Sócio 1", proLabore: 4500.00, participacao: 60},
            {id: 2, nome: "Sócio 2", proLabore: 3000.00, participacao: 40}
        ];

        this.state.despesasFixas = [
            {id: 1, descricao: "Aluguel", valor: 3500.00, categoria: "Infraestrutura"},
            {id: 2, descricao: "Energia Elétrica", valor: 450.00, categoria: "Utilities"},
            {id: 3, descricao: "Água", valor: 120.00, categoria: "Utilities"},
            {id: 4, descricao: "Internet/Telefone", valor: 200.00, categoria: "Comunicação"},
            {id: 5, descricao: "Marketing Digital", valor: 800.00, categoria: "Marketing"},
            {id: 6, descricao: "Contabilidade", valor: 600.00, categoria: "Serviços"},
            {id: 7, descricao: "Seguro", valor: 300.00, categoria: "Seguros"},
            {id: 8, descricao: "Limpeza", valor: 600.00, categoria: "Serviços"}
        ];

        this.state.despesasVariaveis = [
            {id: 1, descricao: "Comissão Vendas (5%)", valor: 450.00, observacao: "Estimativa baseada em R$ 9.000 receita mensal"},
            {id: 2, descricao: "Taxa Cartão Crédito (3.5%)", valor: 315.00, observacao: "Estimativa baseada em R$ 9.000 receita mensal"},
            {id: 3, descricao: "Material Promocional", valor: 200.00, observacao: "Valor fixo mensal"},
            {id: 4, descricao: "Manutenção Equipamentos", valor: 180.00, observacao: "2% sobre valor equipamentos"}
        ];

        this.state.consumoMateriais = [
            {servicoId: 1, materialId: 1, quantidade: 25},
            {servicoId: 1, materialId: 2, quantidade: 40},
            {servicoId: 1, materialId: 3, quantidade: 1},
            {servicoId: 2, materialId: 2, quantidade: 35},
            {servicoId: 2, materialId: 3, quantidade: 1},
            {servicoId: 2, materialId: 4, quantidade: 3},
            {servicoId: 3, materialId: 5, quantidade: 20},
            {servicoId: 3, materialId: 3, quantidade: 1},
            {servicoId: 4, materialId: 5, quantidade: 15},
            {servicoId: 4, materialId: 3, quantidade: 1},
            {servicoId: 5, materialId: 5, quantidade: 25},
            {servicoId: 5, materialId: 3, quantidade: 1}
        ];

        this.state.produtosPorServico = [
            {servicoId: 1, produtoId: 1, quantidade: 0.1},
            {servicoId: 1, produtoId: 2, quantidade: 0.05},
            {servicoId: 2, produtoId: 2, quantidade: 0.08},
            {servicoId: 2, produtoId: 3, quantidade: 0.02},
            {servicoId: 3, produtoId: 1, quantidade: 0.15},
            {servicoId: 4, produtoId: 1, quantidade: 0.12},
            {servicoId: 5, produtoId: 4, quantidade: 0.25}
        ];
    }

    // Persistência de dados
    saveToStorage() {
        try {
            const dataToSave = {
                ...this.state,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('financial_analysis_data', JSON.stringify(dataToSave));
            console.log('Dados salvos no localStorage');
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
        }
    }

    loadFromStorage() {
        try {
            const savedData = localStorage.getItem('financial_analysis_data');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                Object.keys(this.state).forEach(key => {
                    if (parsedData[key]) {
                        this.state[key] = parsedData[key];
                    }
                });
                console.log('Dados carregados do localStorage');
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }

    setupNavigation() {
        console.log('Configurando navegação...');
        const navTabs = document.querySelectorAll('.nav-tab');
        
        navTabs.forEach((tab) => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const targetSection = tab.dataset.section;
                console.log('Clicou na tab:', targetSection);
                if (targetSection) {
                    this.switchToSection(targetSection);
                }
            });
        });
        
        console.log('Navegação configurada para', navTabs.length, 'tabs');
    }

    switchToSection(sectionName) {
        console.log('Mudando para seção:', sectionName);
        
        const navTabs = document.querySelectorAll('.nav-tab');
        const sections = document.querySelectorAll('.app-section');
        
        navTabs.forEach(tab => tab.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        const targetTab = document.querySelector(`[data-section="${sectionName}"]`);
        const targetSection = document.getElementById(sectionName);
        
        if (targetTab) {
            targetTab.classList.add('active');
            console.log('Tab ativada:', sectionName);
        }
        
        if (targetSection) {
            targetSection.classList.add('active');
            console.log('Seção ativada:', sectionName);
            
            this.currentSection = sectionName;
            
            setTimeout(() => {
                if (sectionName === 'dashboard') {
                    this.renderDashboardCharts();
                } else if (sectionName === 'relatorios') {
                    this.renderReportCharts();
                } else if (sectionName === 'projecao') {
                    this.renderProjecaoChart();
                }
            }, 200);
        } else {
            console.error('Seção não encontrada:', sectionName);
        }
    }

    setupEventListeners() {
        // Parâmetros de atendimento
        const paramFields = ['horasUteisPorDia', 'diasUteisPorMes', 'taxaOcupacao'];
        paramFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.addEventListener('input', (e) => {
                    let value = parseFloat(e.target.value) || 0;
                    this.state.parametrosAtendimento[fieldId] = value;
                    this.calculate();
                    this.saveToStorage();
                });
            }
        });

        // Parâmetros de projeção
        const projecaoFields = ['mesesProjecao', 'crescimentoReceita', 'crescimentoCustos', 'investimentoMarketing'];
        projecaoFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.addEventListener('input', (e) => {
                    let value = parseFloat(e.target.value) || 0;
                    this.state.parametrosProjecao[fieldId] = value;
                    this.saveToStorage();
                });
            }
        });
    }

    renderAll() {
        this.renderServicos();
        this.renderProdutos();
        this.renderMateriais();
        this.renderEquipamentos();
        this.renderFuncionarios();
        this.renderSocios();
        this.renderDespesasFixas();
        this.renderDespesasVariaveis();
        this.renderParametros();
        this.renderConsumoMateriais();
        this.renderProdutosPorServico();
        this.renderParametrosProjecao();
    }

    // CRUD Serviços
    renderServicos() {
        const tbody = document.getElementById('servicosTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = this.state.servicos.map(servico => `
            <tr data-id="${servico.id}">
                <td><input type="text" value="${servico.codigo}" onchange="window.app.updateServico(${servico.id}, 'codigo', this.value)"></td>
                <td><input type="text" value="${servico.nome}" onchange="window.app.updateServico(${servico.id}, 'nome', this.value)"></td>
                <td><input type="number" value="${servico.duracao}" onchange="window.app.updateServico(${servico.id}, 'duracao', parseFloat(this.value))"></td>
                <td><input type="text" value="${servico.categoria}" onchange="window.app.updateServico(${servico.id}, 'categoria', this.value)"></td>
                <td><input type="number" value="${servico.margemDesejada}" step="0.1" onchange="window.app.updateServico(${servico.id}, 'margemDesejada', parseFloat(this.value))"></td>
                <td><button class="btn-action btn-remove" onclick="window.app.removeServico(${servico.id})">Remover</button></td>
            </tr>
        `).join('');
    }

    adicionarServico() {
        const newId = Math.max(...this.state.servicos.map(s => s.id), 0) + 1;
        const novoServico = {
            id: newId,
            codigo: `SRV${newId.toString().padStart(2, '0')}`,
            nome: 'Novo Serviço',
            duracao: 60,
            categoria: 'Corporal',
            margemDesejada: 50
        };
        
        this.state.servicos.push(novoServico);
        this.state.produtos.forEach(produto => {
            this.state.produtosPorServico.push({
                servicoId: newId,
                produtoId: produto.id,
                quantidade: 0
            });
        });
        
        this.renderServicos();
        this.renderProdutosPorServico();
        this.calculate();
        this.saveToStorage();
    }

    updateServico(id, field, value) {
        const servico = this.state.servicos.find(s => s.id === id);
        if (servico) {
            servico[field] = value;
            this.calculate();
            this.saveToStorage();
        }
    }

    removeServico(id) {
        this.state.servicos = this.state.servicos.filter(s => s.id !== id);
        this.state.consumoMateriais = this.state.consumoMateriais.filter(c => c.servicoId !== id);
        this.state.produtosPorServico = this.state.produtosPorServico.filter(p => p.servicoId !== id);
        this.renderServicos();
        this.renderConsumoMateriais();
        this.renderProdutosPorServico();
        this.calculate();
        this.saveToStorage();
    }

    // CRUD Produtos
    renderProdutos() {
        const tbody = document.getElementById('produtosTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = this.state.produtos.map(produto => `
            <tr data-id="${produto.id}">
                <td><input type="text" value="${produto.codigo}" onchange="window.app.updateProduto(${produto.id}, 'codigo', this.value)"></td>
                <td><input type="text" value="${produto.nome}" onchange="window.app.updateProduto(${produto.id}, 'nome', this.value)"></td>
                <td><input type="number" step="0.01" value="${produto.custoProduto}" onchange="window.app.updateProduto(${produto.id}, 'custoProduto', parseFloat(this.value))"></td>
                <td><input type="number" step="0.1" value="${produto.margemDesejada}" onchange="window.app.updateProduto(${produto.id}, 'margemDesejada', parseFloat(this.value))"></td>
                <td><input type="text" value="${produto.categoria}" onchange="window.app.updateProduto(${produto.id}, 'categoria', this.value)"></td>
                <td><button class="btn-action btn-remove" onclick="window.app.removeProduto(${produto.id})">Remover</button></td>
            </tr>
        `).join('');
    }

    adicionarProduto() {
        const newId = Math.max(...this.state.produtos.map(p => p.id), 0) + 1;
        const novoProduto = {
            id: newId,
            codigo: `PROD${newId.toString().padStart(2, '0')}`,
            nome: 'Novo Produto',
            custoProduto: 0,
            margemDesejada: 100,
            categoria: 'Cosméticos'
        };
        
        this.state.produtos.push(novoProduto);
        this.state.servicos.forEach(servico => {
            this.state.produtosPorServico.push({
                servicoId: servico.id,
                produtoId: newId,
                quantidade: 0
            });
        });
        
        this.renderProdutos();
        this.renderProdutosPorServico();
        this.calculate();
        this.saveToStorage();
    }

    updateProduto(id, field, value) {
        const produto = this.state.produtos.find(p => p.id === id);
        if (produto) {
            produto[field] = value;
            this.calculate();
            this.saveToStorage();
        }
    }

    removeProduto(id) {
        this.state.produtos = this.state.produtos.filter(p => p.id !== id);
        this.state.produtosPorServico = this.state.produtosPorServico.filter(pp => pp.produtoId !== id);
        this.renderProdutos();
        this.renderProdutosPorServico();
        this.calculate();
        this.saveToStorage();
    }

    // CRUD Materiais
    renderMateriais() {
        const tbody = document.getElementById('materiaisTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = this.state.materiais.map(material => `
            <tr data-id="${material.id}">
                <td><input type="text" value="${material.codigo}" onchange="window.app.updateMaterial(${material.id}, 'codigo', this.value)"></td>
                <td><input type="text" value="${material.nome}" onchange="window.app.updateMaterial(${material.id}, 'nome', this.value)"></td>
                <td><input type="number" step="0.01" value="${material.custoUnitario}" onchange="window.app.updateMaterial(${material.id}, 'custoUnitario', parseFloat(this.value))"></td>
                <td><input type="number" value="${material.rendimento}" onchange="window.app.updateMaterial(${material.id}, 'rendimento', parseFloat(this.value))"></td>
                <td><input type="text" value="${material.unidade}" onchange="window.app.updateMaterial(${material.id}, 'unidade', this.value)"></td>
                <td><button class="btn-action btn-remove" onclick="window.app.removeMaterial(${material.id})">Remover</button></td>
            </tr>
        `).join('');
    }

    adicionarMaterial() {
        const newId = Math.max(...this.state.materiais.map(m => m.id), 0) + 1;
        this.state.materiais.push({
            id: newId,
            codigo: `MAT${newId.toString().padStart(2, '0')}`,
            nome: 'Novo Material',
            custoUnitario: 0,
            rendimento: 1,
            unidade: 'unid'
        });
        this.renderMateriais();
        this.renderConsumoMateriais();
        this.calculate();
        this.saveToStorage();
    }

    updateMaterial(id, field, value) {
        const material = this.state.materiais.find(m => m.id === id);
        if (material) {
            material[field] = value;
            this.calculate();
            this.saveToStorage();
        }
    }

    removeMaterial(id) {
        this.state.materiais = this.state.materiais.filter(m => m.id !== id);
        this.state.consumoMateriais = this.state.consumoMateriais.filter(c => c.materialId !== id);
        this.renderMateriais();
        this.renderConsumoMateriais();
        this.calculate();
        this.saveToStorage();
    }

    // CRUD Equipamentos
    renderEquipamentos() {
        const tbody = document.getElementById('equipamentosTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = this.state.equipamentos.map(equipamento => `
            <tr data-id="${equipamento.id}">
                <td><input type="text" value="${equipamento.codigo}" onchange="window.app.updateEquipamento(${equipamento.id}, 'codigo', this.value)"></td>
                <td><input type="text" value="${equipamento.nome}" onchange="window.app.updateEquipamento(${equipamento.id}, 'nome', this.value)"></td>
                <td><input type="number" step="0.01" value="${equipamento.custoAquisicao}" onchange="window.app.updateEquipamento(${equipamento.id}, 'custoAquisicao', parseFloat(this.value))"></td>
                <td><input type="number" value="${equipamento.vidaUtil}" onchange="window.app.updateEquipamento(${equipamento.id}, 'vidaUtil', parseFloat(this.value))"></td>
                <td><input type="number" step="0.01" value="${equipamento.custoHora.toFixed(2)}" readonly></td>
                <td><button class="btn-action btn-remove" onclick="window.app.removeEquipamento(${equipamento.id})">Remover</button></td>
            </tr>
        `).join('');
    }

    adicionarEquipamento() {
        const newId = Math.max(...this.state.equipamentos.map(e => e.id), 0) + 1;
        this.state.equipamentos.push({
            id: newId,
            codigo: `EQP${newId.toString().padStart(2, '0')}`,
            nome: 'Novo Equipamento',
            custoAquisicao: 0,
            vidaUtil: 36,
            custoHora: 0
        });
        this.renderEquipamentos();
        this.calculate();
        this.saveToStorage();
    }

    updateEquipamento(id, field, value) {
        const equipamento = this.state.equipamentos.find(e => e.id === id);
        if (equipamento) {
            equipamento[field] = value;
            if (field === 'custoAquisicao' || field === 'vidaUtil') {
                equipamento.custoHora = this.calcularCustoHora(equipamento);
            }
            this.renderEquipamentos();
            this.calculate();
            this.saveToStorage();
        }
    }

    removeEquipamento(id) {
        this.state.equipamentos = this.state.equipamentos.filter(e => e.id !== id);
        this.renderEquipamentos();
        this.calculate();
        this.saveToStorage();
    }

    calcularCustoHora(equipamento) {
        const horasTotais = equipamento.vidaUtil * this.state.parametrosAtendimento.horasUteisPorDia * this.state.parametrosAtendimento.diasUteisPorMes;
        return horasTotais > 0 ? equipamento.custoAquisicao / horasTotais : 0;
    }

    // CRUD Funcionários
    renderFuncionarios() {
        const tbody = document.getElementById('funcionariosTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = this.state.funcionarios.map(funcionario => `
            <tr data-id="${funcionario.id}">
                <td><input type="text" value="${funcionario.nome}" onchange="window.app.updateFuncionario(${funcionario.id}, 'nome', this.value)"></td>
                <td><input type="text" value="${funcionario.cargo}" onchange="window.app.updateFuncionario(${funcionario.id}, 'cargo', this.value)"></td>
                <td><input type="number" step="0.01" value="${funcionario.salario}" onchange="window.app.updateFuncionario(${funcionario.id}, 'salario', parseFloat(this.value))"></td>
                <td><button class="btn-action btn-remove" onclick="window.app.removeFuncionario(${funcionario.id})">Remover</button></td>
            </tr>
        `).join('');
    }

    adicionarFuncionario() {
        const newId = Math.max(...this.state.funcionarios.map(f => f.id), 0) + 1;
        this.state.funcionarios.push({
            id: newId,
            nome: 'Novo Funcionário',
            cargo: 'Cargo',
            salario: 1500.00
        });
        this.renderFuncionarios();
        this.calculate();
        this.saveToStorage();
    }

    updateFuncionario(id, field, value) {
        const funcionario = this.state.funcionarios.find(f => f.id === id);
        if (funcionario) {
            funcionario[field] = value;
            this.calculate();
            this.saveToStorage();
        }
    }

    removeFuncionario(id) {
        this.state.funcionarios = this.state.funcionarios.filter(f => f.id !== id);
        this.renderFuncionarios();
        this.calculate();
        this.saveToStorage();
    }

    // CRUD Sócios
    renderSocios() {
        const tbody = document.getElementById('sociosTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = this.state.socios.map(socio => `
            <tr data-id="${socio.id}">
                <td><input type="text" value="${socio.nome}" onchange="window.app.updateSocio(${socio.id}, 'nome', this.value)"></td>
                <td><input type="number" step="0.01" value="${socio.proLabore}" onchange="window.app.updateSocio(${socio.id}, 'proLabore', parseFloat(this.value))"></td>
                <td><input type="number" step="0.1" value="${socio.participacao}" onchange="window.app.updateSocio(${socio.id}, 'participacao', parseFloat(this.value))"></td>
                <td><button class="btn-action btn-remove" onclick="window.app.removeSocio(${socio.id})">Remover</button></td>
            </tr>
        `).join('');
    }

    adicionarSocio() {
        const newId = Math.max(...this.state.socios.map(s => s.id), 0) + 1;
        this.state.socios.push({
            id: newId,
            nome: 'Novo Sócio',
            proLabore: 3000.00,
            participacao: 50
        });
        this.renderSocios();
        this.calculate();
        this.saveToStorage();
    }

    updateSocio(id, field, value) {
        const socio = this.state.socios.find(s => s.id === id);
        if (socio) {
            socio[field] = value;
            this.calculate();
            this.saveToStorage();
        }
    }

    removeSocio(id) {
        this.state.socios = this.state.socios.filter(s => s.id !== id);
        this.renderSocios();
        this.calculate();
        this.saveToStorage();
    }

    // CRUD Despesas Fixas
    renderDespesasFixas() {
        const tbody = document.getElementById('despesasFixasTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = this.state.despesasFixas.map(despesa => `
            <tr data-id="${despesa.id}">
                <td><input type="text" value="${despesa.descricao}" onchange="window.app.updateDespesaFixa(${despesa.id}, 'descricao', this.value)"></td>
                <td><input type="number" step="0.01" value="${despesa.valor}" onchange="window.app.updateDespesaFixa(${despesa.id}, 'valor', parseFloat(this.value))"></td>
                <td><input type="text" value="${despesa.categoria}" onchange="window.app.updateDespesaFixa(${despesa.id}, 'categoria', this.value)"></td>
                <td><button class="btn-action btn-remove" onclick="window.app.removeDespesaFixa(${despesa.id})">Remover</button></td>
            </tr>
        `).join('');
    }

    adicionarDespesaFixa() {
        const newId = Math.max(...this.state.despesasFixas.map(d => d.id), 0) + 1;
        this.state.despesasFixas.push({
            id: newId,
            descricao: 'Nova Despesa',
            valor: 0,
            categoria: 'Geral'
        });
        this.renderDespesasFixas();
        this.calculate();
        this.saveToStorage();
    }

    updateDespesaFixa(id, field, value) {
        const despesa = this.state.despesasFixas.find(d => d.id === id);
        if (despesa) {
            despesa[field] = value;
            this.calculate();
            this.saveToStorage();
        }
    }

    removeDespesaFixa(id) {
        this.state.despesasFixas = this.state.despesasFixas.filter(d => d.id !== id);
        this.renderDespesasFixas();
        this.calculate();
        this.saveToStorage();
    }

    // CRUD Despesas Variáveis
    renderDespesasVariaveis() {
        const tbody = document.getElementById('despesasVariaveisTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = this.state.despesasVariaveis.map(despesa => `
            <tr data-id="${despesa.id}">
                <td><input type="text" value="${despesa.descricao}" onchange="window.app.updateDespesaVariavel(${despesa.id}, 'descricao', this.value)"></td>
                <td><input type="number" step="0.01" value="${despesa.valor}" onchange="window.app.updateDespesaVariavel(${despesa.id}, 'valor', parseFloat(this.value))"></td>
                <td><input type="text" value="${despesa.observacao}" onchange="window.app.updateDespesaVariavel(${despesa.id}, 'observacao', this.value)"></td>
                <td><button class="btn-action btn-remove" onclick="window.app.removeDespesaVariavel(${despesa.id})">Remover</button></td>
            </tr>
        `).join('');
    }

    adicionarDespesaVariavel() {
        const newId = Math.max(...this.state.despesasVariaveis.map(d => d.id), 0) + 1;
        this.state.despesasVariaveis.push({
            id: newId,
            descricao: 'Nova Despesa Variável',
            valor: 0,
            observacao: ''
        });
        this.renderDespesasVariaveis();
        this.calculate();
        this.saveToStorage();
    }

    updateDespesaVariavel(id, field, value) {
        const despesa = this.state.despesasVariaveis.find(d => d.id === id);
        if (despesa) {
            despesa[field] = value;
            this.calculate();
            this.saveToStorage();
        }
    }

    removeDespesaVariavel(id) {
        this.state.despesasVariaveis = this.state.despesasVariaveis.filter(d => d.id !== id);
        this.renderDespesasVariaveis();
        this.calculate();
        this.saveToStorage();
    }

    renderParametros() {
        const fields = {
            'horasUteisPorDia': this.state.parametrosAtendimento.horasUteisPorDia,
            'diasUteisPorMes': this.state.parametrosAtendimento.diasUteisPorMes,
            'taxaOcupacao': this.state.parametrosAtendimento.taxaOcupacao
        };

        Object.entries(fields).forEach(([fieldId, value]) => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.value = value;
            }
        });
    }

    renderParametrosProjecao() {
        const fields = {
            'mesesProjecao': this.state.parametrosProjecao.mesesProjecao,
            'crescimentoReceita': this.state.parametrosProjecao.crescimentoReceita,
            'crescimentoCustos': this.state.parametrosProjecao.crescimentoCustos,
            'investimentoMarketing': this.state.parametrosProjecao.investimentoMarketing
        };

        Object.entries(fields).forEach(([fieldId, value]) => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.value = value;
            }
        });
    }

    // Renderizar Consumo de Materiais
    renderConsumoMateriais() {
        const container = document.getElementById('consumoMateriaisContainer');
        if (!container) return;

        container.innerHTML = this.state.servicos.map(servico => {
            const materiaisHTML = this.state.materiais.map(material => {
                const consumo = this.state.consumoMateriais.find(c => c.servicoId === servico.id && c.materialId === material.id);
                const quantidade = consumo ? consumo.quantidade : 0;
                
                return `
                    <div class="material-input">
                        <label>${material.nome}</label>
                        <input type="number" value="${quantidade}" step="0.1" 
                               onchange="window.app.updateConsumoMaterial(${servico.id}, ${material.id}, parseFloat(this.value))">
                    </div>
                `;
            }).join('');

            return `
                <div class="consumo-servico">
                    <div class="consumo-servico-header">${servico.nome}</div>
                    <div class="consumo-servico-body">
                        <div class="consumo-grid">
                            ${materiaisHTML}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateConsumoMaterial(servicoId, materialId, quantidade) {
        const existingIndex = this.state.consumoMateriais.findIndex(c => c.servicoId === servicoId && c.materialId === materialId);
        
        if (existingIndex >= 0) {
            if (quantidade > 0) {
                this.state.consumoMateriais[existingIndex].quantidade = quantidade;
            } else {
                this.state.consumoMateriais.splice(existingIndex, 1);
            }
        } else if (quantidade > 0) {
            this.state.consumoMateriais.push({ servicoId, materialId, quantidade });
        }
        
        this.calculate();
        this.saveToStorage();
    }

    // Renderizar Produtos por Serviço
    renderProdutosPorServico() {
        const container = document.getElementById('produtosPorServicoContainer');
        if (!container) return;

        container.innerHTML = this.state.servicos.map(servico => {
            const produtosHTML = this.state.produtos.map(produto => {
                const consumo = this.state.produtosPorServico.find(p => p.servicoId === servico.id && p.produtoId === produto.id);
                const quantidade = consumo ? consumo.quantidade : 0;
                
                return `
                    <div class="produto-input">
                        <label>${produto.nome} (R$ ${produto.custoProduto.toFixed(2)})</label>
                        <input type="number" value="${quantidade}" step="0.01" 
                               onchange="window.app.updateProdutosPorServico(${servico.id}, ${produto.id}, parseFloat(this.value))">
                    </div>
                `;
            }).join('');

            return `
                <div class="produtos-servico">
                    <div class="produtos-servico-header">${servico.nome}</div>
                    <div class="produtos-servico-body">
                        <div class="produtos-grid">
                            ${produtosHTML}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateProdutosPorServico(servicoId, produtoId, quantidade) {
        const existingIndex = this.state.produtosPorServico.findIndex(p => p.servicoId === servicoId && p.produtoId === produtoId);
        
        if (existingIndex >= 0) {
            if (quantidade > 0) {
                this.state.produtosPorServico[existingIndex].quantidade = quantidade;
            } else {
                this.state.produtosPorServico.splice(existingIndex, 1);
            }
        } else if (quantidade > 0) {
            this.state.produtosPorServico.push({ servicoId, produtoId, quantidade });
        }
        
        this.calculate();
        this.saveToStorage();
    }

    // Cálculos principais
    calculate() {
        this.calculosServicos = this.calcularCustosServicos();
        this.calculosProdutos = this.calcularCustosProdutos();
        this.renderCustoHoraDetalhado();
        this.renderCalculos();
        this.renderRelatorios();
        this.renderDashboard();
    }

    calcularCustosServicos() {
        const { parametrosAtendimento } = this.state;
        const horasProdutivasMes = parametrosAtendimento.horasUteisPorDia * parametrosAtendimento.diasUteisPorMes;
        
        // Calcular custos fixos total
        const custoOperacionais = this.state.despesasFixas.reduce((sum, d) => sum + d.valor, 0);
        const custoFolhaCLT = this.state.funcionarios.reduce((sum, f) => sum + f.salario * 1.5544, 0); // 55.44% encargos
        const custoProLabore = this.state.socios.reduce((sum, s) => sum + s.proLabore * 1.11, 0); // 11% INSS
        const custoFixoTotal = custoOperacionais + custoFolhaCLT + custoProLabore;
        
        const sessoesMes = horasProdutivasMes * (parametrosAtendimento.taxaOcupacao / 100);
        const custoFixoPorSessao = sessoesMes > 0 ? custoFixoTotal / sessoesMes : 0;
        const custoMaoObraHora = this.state.funcionarios.length > 0 ? 
            (this.state.funcionarios.reduce((sum, f) => sum + f.salario * 1.5544, 0)) / horasProdutivasMes : 0;

        return this.state.servicos.map(servico => {
            const custoMaterial = this.calcularCustoMaterialServico(servico.id);
            const custoProdutosConsumidos = this.calcularCustoProdutosConsumidos(servico.id);
            const custoMaterialTotal = custoMaterial + custoProdutosConsumidos;
            const custoMaoObra = custoMaoObraHora * (servico.duracao / 60);
            const custoEquipamento = this.calcularCustoEquipamento(servico.duracao);
            const custoTotal = custoMaterialTotal + custoMaoObra + custoEquipamento + custoFixoPorSessao;
            
            // Markup individual por serviço
            const markupFactor = servico.margemDesejada / (100 - servico.margemDesejada);
            const precoSugerido = custoTotal * (1 + markupFactor);
            const margem = custoTotal > 0 ? servico.margemDesejada : 0;

            return {
                servico,
                custoMaterial: custoMaterialTotal,
                custoMaoObra,
                custoEquipamento,
                custoFixoRateado: custoFixoPorSessao,
                custoTotal,
                precoSugerido,
                margem
            };
        });
    }

    calcularCustoMaterialServico(servicoId) {
        const consumos = this.state.consumoMateriais.filter(c => c.servicoId === servicoId);
        return consumos.reduce((total, consumo) => {
            const material = this.state.materiais.find(m => m.id === consumo.materialId);
            if (material) {
                const custoUnitario = material.custoUnitario / material.rendimento;
                return total + (custoUnitario * consumo.quantidade);
            }
            return total;
        }, 0);
    }

    calcularCustoProdutosConsumidos(servicoId) {
        const produtosConsumidos = this.state.produtosPorServico.filter(p => p.servicoId === servicoId);
        return produtosConsumidos.reduce((total, consumo) => {
            const produto = this.state.produtos.find(p => p.id === consumo.produtoId);
            if (produto) {
                return total + (produto.custoProduto * consumo.quantidade);
            }
            return total;
        }, 0);
    }

    calcularCustoEquipamento(duracao) {
        const duracaoHoras = duracao / 60;
        return this.state.equipamentos.reduce((total, equipamento) => {
            return total + (equipamento.custoHora * duracaoHoras);
        }, 0);
    }

    calcularCustosProdutos() {
        const custoFixoTotal = this.state.despesasFixas.reduce((sum, d) => sum + d.valor, 0);
        const custoRateadoPorProduto = this.state.produtos.length > 0 ? custoFixoTotal / this.state.produtos.length : 0;

        return this.state.produtos.map(produto => {
            const custoTotal = produto.custoProduto + custoRateadoPorProduto;
            const markupFactor = produto.margemDesejada / 100;
            const precoVenda = produto.custoProduto * (1 + markupFactor);
            const margem = produto.margemDesejada;

            return {
                produto,
                custoProduto: produto.custoProduto,
                custoRateado: custoRateadoPorProduto,
                custoTotal,
                precoVenda,
                margem
            };
        });
    }

    // Renderizar Custo de Hora Detalhado
    renderCustoHoraDetalhado() {
        const custoSalarios = this.state.funcionarios.reduce((sum, f) => sum + f.salario * 1.5544, 0);
        const custoProLabore = this.state.socios.reduce((sum, s) => sum + s.proLabore * 1.11, 0);
        const totalFolha = custoSalarios + custoProLabore;
        const horasProdutivasMes = this.state.parametrosAtendimento.horasUteisPorDia * this.state.parametrosAtendimento.diasUteisPorMes;
        const custoPorHora = horasProdutivasMes > 0 ? totalFolha / horasProdutivasMes : 0;

        this.updateElementText('custoSalarios', this.formatCurrency(custoSalarios));
        this.updateElementText('custoProLabore', this.formatCurrency(custoProLabore));
        this.updateElementText('totalFolha', this.formatCurrency(totalFolha));
        this.updateElementText('horasProdutivas', horasProdutivasMes + 'h');
        this.updateElementText('custoPorHoraFinal', this.formatCurrency(custoPorHora));
    }

    renderCalculos() {
        // Renderizar cálculos de serviços
        const tbodyServicos = document.getElementById('calculosServicosTableBody');
        if (tbodyServicos && this.calculosServicos) {
            tbodyServicos.innerHTML = this.calculosServicos.map(calculo => `
                <tr>
                    <td>${calculo.servico.nome}</td>
                    <td>${this.formatCurrency(calculo.custoMaterial)}</td>
                    <td>${this.formatCurrency(calculo.custoMaoObra)}</td>
                    <td>${this.formatCurrency(calculo.custoEquipamento)}</td>
                    <td>${this.formatCurrency(calculo.custoFixoRateado)}</td>
                    <td><strong>${this.formatCurrency(calculo.custoTotal)}</strong></td>
                    <td><strong>${this.formatCurrency(calculo.precoSugerido)}</strong></td>
                    <td>${calculo.margem.toFixed(1)}%</td>
                </tr>
            `).join('');
        }

        // Renderizar cálculos de produtos
        const tbodyProdutos = document.getElementById('calculosProdutosTableBody');
        if (tbodyProdutos && this.calculosProdutos) {
            tbodyProdutos.innerHTML = this.calculosProdutos.map(calculo => `
                <tr>
                    <td>${calculo.produto.nome}</td>
                    <td>${this.formatCurrency(calculo.custoProduto)}</td>
                    <td>${this.formatCurrency(calculo.custoRateado)}</td>
                    <td><strong>${this.formatCurrency(calculo.custoTotal)}</strong></td>
                    <td><strong>${this.formatCurrency(calculo.precoVenda)}</strong></td>
                    <td>${calculo.margem.toFixed(1)}%</td>
                </tr>
            `).join('');
        }
    }

    renderDashboard() {
        if (!this.calculosServicos || this.calculosServicos.length === 0) return;

        // Calcular KPIs
        const receitaServicos = this.calculosServicos.reduce((sum, calc) => sum + calc.precoSugerido, 0) * 10;
        const receitaProdutos = this.calculosProdutos.reduce((sum, calc) => sum + calc.precoVenda, 0) * 5;
        const receitaMensal = receitaServicos + receitaProdutos;
        const ticketMedio = this.calculosServicos.reduce((sum, calc) => sum + calc.precoSugerido, 0) / this.calculosServicos.length;
        const margemMedia = this.calculosServicos.reduce((sum, calc) => sum + calc.margem, 0) / this.calculosServicos.length;
        
        const custoFixoTotal = this.state.despesasFixas.reduce((sum, d) => sum + d.valor, 0);
        const custoVariavelTotal = this.state.despesasVariaveis.reduce((sum, d) => sum + d.valor, 0);
        const resultadoMensal = receitaMensal - custoFixoTotal - custoVariavelTotal;

        this.updateElementText('receitaMensal', this.formatCurrency(receitaMensal));
        this.updateElementText('ticketMedioDash', this.formatCurrency(ticketMedio));
        this.updateElementText('margemMediaDash', margemMedia.toFixed(1) + '%');
        this.updateElementText('resultadoMensalDash', this.formatCurrency(resultadoMensal));
    }

    renderDashboardCharts() {
        if (!this.calculosServicos || this.calculosServicos.length === 0) return;

        // Receita por serviço
        const canvasReceita = document.getElementById('receitaPorServicoChart');
        if (canvasReceita) {
            const ctx = canvasReceita.getContext('2d');
            
            if (this.charts.receitaServico) {
                this.charts.receitaServico.destroy();
            }

            this.charts.receitaServico = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: this.calculosServicos.map(c => c.servico.nome),
                    datasets: [{
                        label: 'Preço Sugerido',
                        data: this.calculosServicos.map(c => c.precoSugerido),
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'R$ ' + value.toLocaleString('pt-BR');
                                }
                            }
                        }
                    }
                }
            });
        }

        // Composição de custos
        const canvasCustos = document.getElementById('custosComposicaoChart');
        if (canvasCustos) {
            const ctx = canvasCustos.getContext('2d');
            
            if (this.charts.custosComposicao) {
                this.charts.custosComposicao.destroy();
            }

            const custoFixoTotal = this.state.despesasFixas.reduce((sum, d) => sum + d.valor, 0);
            const custoMaterialTotal = this.calculosServicos.reduce((sum, calc) => sum + calc.custoMaterial, 0);
            const custoMaoObraTotal = this.calculosServicos.reduce((sum, calc) => sum + calc.custoMaoObra, 0);
            const custoEquipamentoTotal = this.calculosServicos.reduce((sum, calc) => sum + calc.custoEquipamento, 0);

            this.charts.custosComposicao = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Custos Fixos', 'Materiais', 'Mão de Obra', 'Equipamentos'],
                    datasets: [{
                        data: [custoFixoTotal, custoMaterialTotal, custoMaoObraTotal, custoEquipamentoTotal],
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });
        }
    }

    renderRelatorios() {
        if (!this.calculosServicos || this.calculosServicos.length === 0) return;

        // Calcular valores para o DRE detalhado
        const receitaServicos = this.calculosServicos.reduce((sum, calc) => sum + calc.precoSugerido, 0) * 10;
        const receitaProdutos = this.calculosProdutos.reduce((sum, calc) => sum + calc.precoVenda, 0) * 5;
        const receitaBruta = receitaServicos + receitaProdutos;
        
        // Custos variáveis detalhados
        const custoMateriais = this.calculosServicos.reduce((sum, calc) => sum + calc.custoMaterial, 0) * 10;
        const custoComissoes = this.state.despesasVariaveis.find(d => d.descricao.includes('Comissão'))?.valor || 0;
        const custosOutrosVariaveis = this.state.despesasVariaveis.reduce((sum, d) => sum + d.valor, 0) - custoComissoes;
        const custosVariaveisTotal = custoMateriais + custoComissoes + custosOutrosVariaveis;
        
        // Margem de contribuição
        const margemContribuicaoValor = receitaBruta - custosVariaveisTotal;
        
        // Custos fixos detalhados
        const custoFolhaCLT = this.state.funcionarios.reduce((sum, f) => sum + f.salario * 1.5544, 0);
        const custoProLaboreTotal = this.state.socios.reduce((sum, s) => sum + s.proLabore * 1.11, 0);
        const custosOperacionais = this.state.despesasFixas.reduce((sum, d) => sum + d.valor, 0);
        const depreciacao = this.state.equipamentos.reduce((sum, e) => sum + (e.custoAquisicao / e.vidaUtil), 0);
        const custosFixosTotal = custoFolhaCLT + custoProLaboreTotal + custosOperacionais + depreciacao;
        
        // EBITDA
        const ebitda = margemContribuicaoValor - custosFixosTotal;
        
        // Impostos
        const iss = receitaServicos * 0.05; // 5% ISS sobre serviços
        
        // Resultado líquido
        const resultadoLiquido = ebitda - iss;

        // Atualizar DRE detalhado
        this.updateElementText('receitaServicos', this.formatCurrency(receitaServicos));
        this.updateElementText('receitaProdutos', this.formatCurrency(receitaProdutos));
        this.updateElementText('receitaBrutaTotal', this.formatCurrency(receitaBruta));
        
        this.updateElementText('custoMateriais', this.formatCurrency(custoMateriais));
        this.updateElementText('custoComissoes', this.formatCurrency(custoComissoes));
        this.updateElementText('custosOutrosVariaveis', this.formatCurrency(custosOutrosVariaveis));
        this.updateElementText('custosVariaveisTotal', this.formatCurrency(custosVariaveisTotal));
        
        this.updateElementText('margemContribuicaoValor', this.formatCurrency(margemContribuicaoValor));
        
        this.updateElementText('custoFolhaCLT', this.formatCurrency(custoFolhaCLT));
        this.updateElementText('custoProLaboreTotal', this.formatCurrency(custoProLaboreTotal));
        this.updateElementText('custosOperacionais', this.formatCurrency(custosOperacionais));
        this.updateElementText('depreciacao', this.formatCurrency(depreciacao));
        this.updateElementText('custosFixosTotal', this.formatCurrency(custosFixosTotal));
        
        this.updateElementText('ebitda', this.formatCurrency(ebitda));
        this.updateElementText('iss', this.formatCurrency(iss));
        this.updateElementText('resultadoLiquido', this.formatCurrency(resultadoLiquido));

        // Indicadores básicos
        const ticketMedio = this.calculosServicos.reduce((sum, calc) => sum + calc.precoSugerido, 0) / this.calculosServicos.length;
        const custoPorSessao = this.calculosServicos.reduce((sum, calc) => sum + calc.custoTotal, 0) / this.calculosServicos.length;
        const horasProdutivasMes = this.state.parametrosAtendimento.horasUteisPorDia * this.state.parametrosAtendimento.diasUteisPorMes;
        const faturamentoHora = receitaBruta / horasProdutivasMes;
        const margemContrib = receitaBruta > 0 ? (margemContribuicaoValor / receitaBruta) * 100 : 0;
        
        this.updateElementText('ticketMedio', this.formatCurrency(ticketMedio));
        this.updateElementText('custoPorSessao', this.formatCurrency(custoPorSessao));
        this.updateElementText('faturamentoHora', this.formatCurrency(faturamentoHora));
        this.updateElementText('margemContribuicao', margemContrib.toFixed(1) + '%');

        // Indicadores avançados
        const margemLiquida = receitaBruta > 0 ? (resultadoLiquido / receitaBruta) * 100 : 0;
        const investimentoTotal = this.state.equipamentos.reduce((sum, e) => sum + e.custoAquisicao, 0);
        const roiAnual = investimentoTotal > 0 ? (resultadoLiquido * 12 / investimentoTotal) * 100 : 0;
        const payback = resultadoLiquido > 0 ? investimentoTotal / resultadoLiquido : 0;
        
        this.updateElementText('margemLiquida', margemLiquida.toFixed(1) + '%');
        this.updateElementText('ebitdaValor', this.formatCurrency(ebitda));
        this.updateElementText('roiAnual', roiAnual.toFixed(1) + '%');
        this.updateElementText('payback', payback.toFixed(0) + ' meses');

        // Análise de Viabilidade
        this.renderAnaliseViabilidade(resultadoLiquido);
    }

    renderAnaliseViabilidade(resultado) {
        const statusElement = document.getElementById('statusBadge');
        const recomendacoesList = document.getElementById('listaRecomendacoes');
        
        if (!statusElement || !recomendacoesList) return;
        
        let status, statusClass, recomendacoes = [];

        if (resultado > 5000) {
            status = 'Negócio Muito Viável';
            statusClass = 'status--success';
            recomendacoes.push('O negócio apresenta excelente resultado com os parâmetros atuais');
            recomendacoes.push('Considere expansão ou investimento em novos equipamentos');
        } else if (resultado > 0) {
            status = 'Negócio Viável';
            statusClass = 'status--success';
            recomendacoes.push('O negócio apresenta resultado positivo');
            recomendacoes.push('Foque em aumentar a taxa de ocupação e melhorar processos');
        } else if (resultado > -2000) {
            status = 'Atenção Necessária';
            statusClass = 'status--warning';
            recomendacoes.push('O negócio está próximo do ponto de equilíbrio');
            recomendacoes.push('Revise custos fixos e estratégias de marketing');
        } else {
            status = 'Não Viável';
            statusClass = 'status--error';
            recomendacoes.push('O negócio apresenta prejuízo significativo');
            recomendacoes.push('Reavalie completamente o modelo de negócio');
        }

        statusElement.className = `status ${statusClass}`;
        statusElement.textContent = status;
        
        recomendacoesList.innerHTML = recomendacoes.map(rec => `<li>${rec}</li>`).join('');
    }

    renderReportCharts() {
        if (!this.calculosServicos || this.calculosServicos.length === 0) return;

        // Gráfico de composição de custos
        const canvasCustos = document.getElementById('custosChart');
        if (canvasCustos) {
            const ctx = canvasCustos.getContext('2d');
            
            if (this.charts.custos) {
                this.charts.custos.destroy();
            }

            const custoFixoTotal = this.state.despesasFixas.reduce((sum, d) => sum + d.valor, 0);
            const custoMaterialTotal = this.calculosServicos.reduce((sum, calc) => sum + calc.custoMaterial, 0);
            const custoMaoObraTotal = this.calculosServicos.reduce((sum, calc) => sum + calc.custoMaoObra, 0);
            const custoEquipamentoTotal = this.calculosServicos.reduce((sum, calc) => sum + calc.custoEquipamento, 0);

            this.charts.custos = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Custos Fixos', 'Materiais', 'Mão de Obra', 'Equipamentos'],
                    datasets: [{
                        data: [custoFixoTotal, custoMaterialTotal, custoMaoObraTotal, custoEquipamentoTotal],
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });
        }

        // Gráfico receita vs custos
        const canvasReceitaCustos = document.getElementById('receitaCustosChart');
        if (canvasReceitaCustos) {
            const ctx = canvasReceitaCustos.getContext('2d');
            
            if (this.charts.receitaCustos) {
                this.charts.receitaCustos.destroy();
            }

            const receitaTotal = this.calculosServicos.reduce((sum, calc) => sum + calc.precoSugerido, 0) * 10;
            const custoTotal = this.state.despesasFixas.reduce((sum, d) => sum + d.valor, 0) + 
                              this.state.despesasVariaveis.reduce((sum, d) => sum + d.valor, 0);

            this.charts.receitaCustos = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Mensal'],
                    datasets: [{
                        label: 'Receita',
                        data: [receitaTotal],
                        backgroundColor: '#1FB8CD'
                    }, {
                        label: 'Custos',
                        data: [custoTotal],
                        backgroundColor: '#B4413C'
                    }, {
                        label: 'Resultado',
                        data: [receitaTotal - custoTotal],
                        backgroundColor: receitaTotal - custoTotal >= 0 ? '#5D878F' : '#DB4545'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: true }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'R$ ' + value.toLocaleString('pt-BR');
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    // Projeção de Crescimento
    calcularProjecao() {
        const { mesesProjecao, crescimentoReceita, crescimentoCustos, investimentoMarketing } = this.state.parametrosProjecao;
        
        // Base mensal atual
        const receitaBase = this.calculosServicos.reduce((sum, calc) => sum + calc.precoSugerido, 0) * 10;
        const custoVariavelBase = this.state.despesasVariaveis.reduce((sum, d) => sum + d.valor, 0);
        const custoFixoBase = this.state.despesasFixas.reduce((sum, d) => sum + d.valor, 0);
        
        this.projecaoData = [];
        let receitaAcumulada = 0;
        let resultadoAcumulado = 0;
        let breakEvenFound = false;
        let breakEvenMes = 0;

        for (let mes = 1; mes <= mesesProjecao; mes++) {
            const fatorCrescimentoReceita = Math.pow(1 + crescimentoReceita / 100, mes - 1);
            const fatorCrescimentoCustos = Math.pow(1 + crescimentoCustos / 100, mes - 1);
            
            const receita = receitaBase * fatorCrescimentoReceita;
            const custoVariavel = custoVariavelBase * fatorCrescimentoCustos;
            const custoFixo = custoFixoBase * fatorCrescimentoCustos;
            const marketing = investimentoMarketing;
            const resultado = receita - custoVariavel - custoFixo - marketing;
            
            receitaAcumulada += receita;
            resultadoAcumulado += resultado;
            
            if (!breakEvenFound && resultadoAcumulado >= 0) {
                breakEvenFound = true;
                breakEvenMes = mes;
            }

            this.projecaoData.push({
                mes,
                receita,
                custoVariavel,
                custoFixo,
                marketing,
                resultado,
                resultadoAcumulado
            });
        }

        // Calcular indicadores de projeção
        const investimentoTotal = this.state.equipamentos.reduce((sum, e) => sum + e.custoAquisicao, 0);
        const investimentoMarketingTotal = investimentoMarketing * mesesProjecao;
        const roiCrescimento = investimentoMarketingTotal > 0 ? (resultadoAcumulado / investimentoMarketingTotal) * 100 : 0;
        const capitalGiro = Math.max(...this.projecaoData.map(p => Math.abs(Math.min(0, p.resultadoAcumulado))));

        // Atualizar indicadores
        this.updateElementText('roiCrescimento', roiCrescimento.toFixed(1) + '%');
        this.updateElementText('breakEvenPoint', breakEvenFound ? breakEvenMes : mesesProjecao);
        this.updateElementText('capitalGiro', this.formatCurrency(capitalGiro));
        this.updateElementText('receitaAcumulada', this.formatCurrency(receitaAcumulada));

        this.renderProjecaoTabela();
        this.renderProjecaoChart();
    }

    renderProjecaoTabela() {
        const tbody = document.getElementById('projecaoTableBody');
        if (!tbody || !this.projecaoData.length) return;

        const inicio = this.paginaProjecaoAtual * this.mesesPorPagina;
        const fim = Math.min(inicio + this.mesesPorPagina, this.projecaoData.length);
        const dadosPagina = this.projecaoData.slice(inicio, fim);

        tbody.innerHTML = dadosPagina.map(proj => `
            <tr>
                <td>Mês ${proj.mes}</td>
                <td>${this.formatCurrency(proj.receita)}</td>
                <td>${this.formatCurrency(proj.custoVariavel)}</td>
                <td>${this.formatCurrency(proj.custoFixo)}</td>
                <td>${this.formatCurrency(proj.marketing)}</td>
                <td class="${proj.resultado >= 0 ? 'positive-value' : 'negative-value'}">
                    ${this.formatCurrency(proj.resultado)}
                </td>
                <td class="${proj.resultadoAcumulado >= 0 ? 'positive-value' : 'negative-value'}">
                    ${this.formatCurrency(proj.resultadoAcumulado)}
                </td>
            </tr>
        `).join('');

        // Atualizar paginação
        const totalPaginas = Math.ceil(this.projecaoData.length / this.mesesPorPagina);
        this.updateElementText('paginaAtual', `Página ${this.paginaProjecaoAtual + 1} de ${totalPaginas}`);
    }

    navegarProjecao(direcao) {
        const totalPaginas = Math.ceil(this.projecaoData.length / this.mesesPorPagina);
        
        if (direcao === -1 && this.paginaProjecaoAtual > 0) {
            this.paginaProjecaoAtual--;
        } else if (direcao === 1 && this.paginaProjecaoAtual < totalPaginas - 1) {
            this.paginaProjecaoAtual++;
        }
        
        this.renderProjecaoTabela();
    }

    renderProjecaoChart() {
        const canvas = document.getElementById('projecaoChart');
        if (!canvas || !this.projecaoData.length) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.projecao) {
            this.charts.projecao.destroy();
        }

        // Mostrar apenas os primeiros 24 meses no gráfico
        const dadosChart = this.projecaoData.slice(0, 24);

        this.charts.projecao = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dadosChart.map(p => `Mês ${p.mes}`),
                datasets: [{
                    label: 'Receita',
                    data: dadosChart.map(p => p.receita),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'transparent',
                    tension: 0.4
                }, {
                    label: 'Resultado',
                    data: dadosChart.map(p => p.resultado),
                    borderColor: '#5D878F',
                    backgroundColor: 'transparent',
                    tension: 0.4
                }, {
                    label: 'Resultado Acumulado',
                    data: dadosChart.map(p => p.resultadoAcumulado),
                    borderColor: '#B4413C',
                    backgroundColor: 'transparent',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    }
                }
            }
        });
    }

    updateElementText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }
}

// Funções globais
function salvarDados() {
    try {
        const dataToExport = {
            ...window.app.state,
            timestamp: new Date().toISOString(),
            version: '2.0'
        };
        
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `analise-viabilidade-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        alert('Dados exportados com sucesso!');
    } catch (error) {
        alert('Erro ao exportar dados: ' + error.message);
    }
}

function carregarBackup(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            if (!importedData.servicos || !importedData.produtos) {
                throw new Error('Arquivo de backup inválido');
            }
            
            Object.keys(window.app.state).forEach(key => {
                if (importedData[key]) {
                    window.app.state[key] = importedData[key];
                }
            });
            
            window.app.renderAll();
            window.app.calculate();
            window.app.saveToStorage();
            
            alert('Backup carregado com sucesso!');
        } catch (error) {
            alert('Erro ao carregar backup: ' + error.message);
        }
    };
    reader.readAsText(file);
}

function limparDados() {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
        localStorage.removeItem('financial_analysis_data');
        location.reload();
    }
}

function imprimirRelatorio() {
    window.app.switchToSection('relatorios');
    setTimeout(() => {
        window.print();
    }, 500);
}

function calcularProjecao() {
    window.app.calcularProjecao();
}

function navegarProjecao(direcao) {
    window.app.navegarProjecao(direcao);
}

// Funções CRUD globais
window.adicionarServico = function() { window.app.adicionarServico(); };
window.adicionarProduto = function() { window.app.adicionarProduto(); };
window.adicionarMaterial = function() { window.app.adicionarMaterial(); };
window.adicionarEquipamento = function() { window.app.adicionarEquipamento(); };
window.adicionarFuncionario = function() { window.app.adicionarFuncionario(); };
window.adicionarSocio = function() { window.app.adicionarSocio(); };
window.adicionarDespesaFixa = function() { window.app.adicionarDespesaFixa(); };
window.adicionarDespesaVariavel = function() { window.app.adicionarDespesaVariavel(); };

window.salvarDados = salvarDados;
window.carregarBackup = carregarBackup;
window.limparDados = limparDados;
window.imprimirRelatorio = imprimirRelatorio;
window.calcularProjecao = calcularProjecao;
window.navegarProjecao = navegarProjecao;

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando aplicação...');
    window.app = new FinancialAnalysisApp();
    window.app.init();
});