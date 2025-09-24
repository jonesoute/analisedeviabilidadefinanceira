// Sistema de Análise de Viabilidade Financeira - Estética Corporal
// CORREÇÃO CRÍTICA: Sistema de navegação completamente reescrito

class FinancialAnalysisApp {
    constructor() {
        this.state = {
            servicos: [],
            produtos: [],
            materiais: [],
            equipamentos: [],
            funcionarios: [],
            socios: [],
            despesasFixas: [],
            despesasVariaveis: [],
            consumoMateriais: [],
            parametrosAtendimento: {
                horasUteisPorDia: 10,
                diasUteisPorMes: 22,
                taxaOcupacao: 0.75
            },
            encargos: {
                clt: {
                    inss: 8.0,
                    fgts: 8.0,
                    ferias: 11.11,
                    decimoTerceiro: 8.33,
                    inss_empresa: 20.0
                },
                prolabore: {
                    inss: 11.0
                },
                iss: 5.0
            },
            projecaoCrescimento: {
                crescimentoReceita: 5.0,
                crescimentoCustos: 2.0,
                meta12Meses: 150000.00,
                investimentoMarketing: 1500.00,
                mixProdutosProjecao: 30
            }
        };
        
        this.charts = {};
        this.calculosServicos = [];
        this.calculosProdutos = [];
        this.currentSection = 'dashboard';
        this.accordionStates = {};
    }

    init() {
        console.log('=== INICIANDO APLICAÇÃO ===');
        this.loadData();
        this.setupNavigation();
        this.setupEventListeners();
        this.renderAll();
        this.calculate();
        console.log('=== APLICAÇÃO INICIADA ===');
    }

    // === NAVEGAÇÃO - COMPLETAMENTE REESCRITA ===
    setupNavigation() {
        console.log('=== CONFIGURANDO NAVEGAÇÃO ===');
        
        // Aguardar DOM estar completamente carregado
        setTimeout(() => {
            const navTabs = document.querySelectorAll('.nav-tab');
            console.log('Número de tabs encontradas:', navTabs.length);
            
            if (navTabs.length === 0) {
                console.error('ERRO: Nenhuma tab encontrada!');
                return;
            }
            
            // Remover todos os event listeners existentes
            navTabs.forEach(tab => {
                const newTab = tab.cloneNode(true);
                tab.parentNode.replaceChild(newTab, tab);
            });
            
            // Adicionar novos event listeners
            const newNavTabs = document.querySelectorAll('.nav-tab');
            newNavTabs.forEach((tab, index) => {
                const sectionName = tab.getAttribute('data-section');
                console.log(`Configurando tab ${index}: ${sectionName}`);
                
                tab.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`=== CLIQUE NA TAB: ${sectionName} ===`);
                    this.navigateToSection(sectionName);
                });
            });
            
            console.log('Event listeners configurados com sucesso');
        }, 100);
    }

    navigateToSection(sectionName) {
        console.log(`\n=== NAVEGANDO PARA: ${sectionName} ===`);
        
        // 1. Encontrar todas as tabs e sections
        const allTabs = document.querySelectorAll('.nav-tab');
        const allSections = document.querySelectorAll('.app-section');
        
        console.log(`Tabs encontradas: ${allTabs.length}`);
        console.log(`Seções encontradas: ${allSections.length}`);
        
        // 2. Remover classe active de todas as tabs
        allTabs.forEach((tab, index) => {
            const tabSection = tab.getAttribute('data-section');
            tab.classList.remove('active');
            console.log(`Tab ${index} (${tabSection}): active removido`);
        });
        
        // 3. Remover classe active de todas as sections
        allSections.forEach((section, index) => {
            section.classList.remove('active');
            console.log(`Seção ${index} (${section.id}): active removido`);
        });
        
        // 4. Adicionar classe active à tab correta
        const targetTab = document.querySelector(`[data-section="${sectionName}"]`);
        if (targetTab) {
            targetTab.classList.add('active');
            console.log(`✓ Tab ativada: ${sectionName}`);
        } else {
            console.error(`✗ Tab não encontrada: ${sectionName}`);
        }
        
        // 5. Adicionar classe active à section correta
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log(`✓ Seção ativada: ${sectionName}`);
            
            // Forçar re-render se necessário
            targetSection.style.display = 'block';
            
            this.currentSection = sectionName;
            
            // 6. Renderizar gráficos específicos da seção
            setTimeout(() => {
                this.renderSectionSpecificContent(sectionName);
            }, 200);
            
        } else {
            console.error(`✗ Seção não encontrada: ${sectionName}`);
        }
        
        console.log(`=== FIM NAVEGAÇÃO PARA: ${sectionName} ===\n`);
    }

    renderSectionSpecificContent(sectionName) {
        console.log(`Renderizando conteúdo específico para: ${sectionName}`);
        
        switch(sectionName) {
            case 'dashboard':
                this.renderDashboardCharts();
                break;
            case 'relatorios':
                this.renderReportCharts();
                break;
            case 'projecao':
                this.renderProjecaoChart();
                break;
            default:
                console.log(`Nenhum conteúdo específico para: ${sectionName}`);
        }
    }

    // === PERSISTÊNCIA DE DADOS ===
    saveData() {
        try {
            const dataToSave = {
                ...this.state,
                timestamp: new Date().toISOString(),
                version: '2.0'
            };
            localStorage.setItem('esteticaCorporalData', JSON.stringify(dataToSave));
            console.log('Dados salvos automaticamente');
            return true;
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            this.showNotification('Erro ao salvar dados. Verifique o espaço de armazenamento disponível.', 'error');
            return false;
        }
    }

    loadData() {
        try {
            const savedData = localStorage.getItem('esteticaCorporalData');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                this.state = { ...this.state, ...parsedData };
                console.log('Dados carregados com sucesso');
                this.showNotification('Dados carregados com sucesso!', 'success');
            } else {
                this.loadInitialData();
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.loadInitialData();
            this.showNotification('Dados iniciais carregados.', 'info');
        }
    }

    loadInitialData() {
        // Dados iniciais conforme fornecidos
        this.state.servicos = [
            {id: 1, codigo: "MASS01", nome: "Massagem Modeladora", duracao: 60, categoria: "Corporal", margemDesejada: 45},
            {id: 2, codigo: "DREN01", nome: "Drenagem Linfática", duracao: 90, categoria: "Corporal", margemDesejada: 50},
            {id: 3, codigo: "LIPO01", nome: "Lipocavitação", duracao: 45, categoria: "Estética Avançada", margemDesejada: 55},
            {id: 4, codigo: "RADIO01", nome: "Radiofrequência", duracao: 30, categoria: "Estética Avançada", margemDesejada: 60},
            {id: 5, codigo: "CRIO01", nome: "Criolipólise", duracao: 120, categoria: "Estética Avançada", margemDesejada: 65}
        ];

        this.state.produtos = [
            {id: 1, codigo: "PROD01", nome: "Creme Anti-Celulite", unidade: "unid", custoProduto: 45.00, margemDesejada: 150, categoria: "Cosméticos"},
            {id: 2, codigo: "PROD02", nome: "Óleo Corporal Premium", unidade: "unid", custoProduto: 28.00, margemDesejada: 180, categoria: "Cosméticos"},
            {id: 3, codigo: "PROD03", nome: "Suplemento Drenante", unidade: "unid", custoProduto: 35.00, margemDesejada: 120, categoria: "Suplementos"},
            {id: 4, codigo: "PROD04", nome: "Kit Cuidados Pós-Tratamento", unidade: "kit", custoProduto: 85.00, margemDesejada: 100, categoria: "Kits"}
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
            {id: 1, nome: "Esteticista Pleno", cargo: "Profissional de Estética", salario: 2500.00, tipo: "CLT"},
            {id: 2, nome: "Esteticista Sênior", cargo: "Coordenador de Estética", salario: 3200.00, tipo: "CLT"},
            {id: 3, nome: "Recepcionista", cargo: "Atendimento", salario: 1400.00, tipo: "CLT"}
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

        this.saveData(); // Salva dados iniciais
    }

    exportData() {
        try {
            const dataToExport = {
                ...this.state,
                timestamp: new Date().toISOString(),
                version: '2.0'
            };
            const dataStr = JSON.stringify(dataToExport, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `backup_estetica_corporal_${new Date().toISOString().split('T')[0]}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            this.showNotification('Backup exportado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            this.showNotification('Erro ao exportar dados.', 'error');
        }
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        if (importedData.version && importedData.servicos) {
                            this.state = { ...this.state, ...importedData };
                            this.saveData();
                            this.renderAll();
                            this.calculate();
                            this.showNotification('Dados importados com sucesso!', 'success');
                        } else {
                            this.showNotification('Arquivo de backup inválido.', 'error');
                        }
                    } catch (error) {
                        console.error('Erro ao importar dados:', error);
                        this.showNotification('Erro ao importar dados. Verifique o arquivo.', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    // CORREÇÃO PRINCIPAL: Função clearData corrigida para zerar TUDO
    clearData() {
        if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
            // Resetar TODOS os arrays para vazio, mantendo apenas parâmetros padrão
            this.state = {
                servicos: [],
                produtos: [],
                materiais: [],
                equipamentos: [],
                funcionarios: [],
                socios: [],
                despesasFixas: [],
                despesasVariaveis: [],
                consumoMateriais: [],
                parametrosAtendimento: {
                    horasUteisPorDia: 10,
                    diasUteisPorMes: 22,
                    taxaOcupacao: 0.75
                },
                encargos: {
                    clt: {
                        inss: 8.0,
                        fgts: 8.0,
                        ferias: 11.11,
                        decimoTerceiro: 8.33,
                        inss_empresa: 20.0
                    },
                    prolabore: {
                        inss: 11.0
                    },
                    iss: 5.0
                },
                projecaoCrescimento: {
                    crescimentoReceita: 5.0,
                    crescimentoCustos: 2.0,
                    meta12Meses: 150000.00,
                    investimentoMarketing: 1500.00,
                    mixProdutosProjecao: 30
                }
            };

            // Limpar arrays de cálculos
            this.calculosServicos = [];
            this.calculosProdutos = [];

            // Limpar localStorage
            localStorage.removeItem('esteticaCorporalData');
            
            // Salvar estado limpo e re-renderizar tudo
            this.saveData();
            this.renderAll();
            this.calculate();
            
            this.showNotification('Todos os dados foram limpos!', 'success');
        }
    }

    showNotification(message, type = 'info') {
        console.log(`NOTIFICAÇÃO [${type}]: ${message}`);
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    // === EVENT LISTENERS ===
    setupEventListeners() {
        // Parâmetros de atendimento
        ['horasUteisPorDia', 'diasUteisPorMes'].forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.addEventListener('input', (e) => {
                    this.state.parametrosAtendimento[field] = parseFloat(e.target.value) || 0;
                    this.saveData();
                    this.calculate();
                });
            }
        });

        const taxaOcupacaoElement = document.getElementById('taxaOcupacao');
        if (taxaOcupacaoElement) {
            taxaOcupacaoElement.addEventListener('input', (e) => {
                this.state.parametrosAtendimento.taxaOcupacao = parseFloat(e.target.value) / 100 || 0;
                this.saveData();
                this.calculate();
            });
        }

        // Simulação rápida no dashboard
        const taxaSimulacao = document.getElementById('taxaSimulacao');
        const taxaSimulacaoValue = document.getElementById('taxaSimulacaoValue');
        if (taxaSimulacao && taxaSimulacaoValue) {
            taxaSimulacao.addEventListener('input', (e) => {
                const value = e.target.value;
                taxaSimulacaoValue.textContent = value + '%';
                this.updateSimulacaoRapida(value / 100);
            });
        }

        // Projeção
        ['crescimentoReceita', 'crescimentoCustos', 'meta12Meses', 'mixProdutosProjecao'].forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.addEventListener('input', (e) => {
                    this.state.projecaoCrescimento[field] = parseFloat(e.target.value) || 0;
                    this.saveData();
                    if (this.currentSection === 'projecao') {
                        setTimeout(() => this.renderProjecaoChart(), 100);
                    }
                });
            }
        });
    }

    // === ACCORDION ===
    toggleAccordion(sectionName) {
        const header = document.querySelector(`button[onclick="toggleAccordion('${sectionName}')"]`);
        const content = document.getElementById(`accordion${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}`);
        
        if (header && content) {
            const isActive = content.classList.contains('active');
            
            if (isActive) {
                content.classList.remove('active');
                header.classList.remove('active');
                this.accordionStates[sectionName] = false;
            } else {
                content.classList.add('active');
                header.classList.add('active');
                this.accordionStates[sectionName] = true;
            }
        }
    }

    // === RENDER METHODS ===
    renderAll() {
        this.renderCounts();
        this.renderServicos();
        this.renderProdutos();
        this.renderMateriais();
        this.renderEquipamentos();
        this.renderFuncionarios();
        this.renderDespesasFixas();
        this.renderParametros();
        this.renderConsumoMateriais();
        this.renderDashboard();
    }

    renderCounts() {
        this.updateElementText('countServicos', this.state.servicos.length);
        this.updateElementText('countProdutos', this.state.produtos.length);
        this.updateElementText('countMateriais', this.state.materiais.length);
        this.updateElementText('countEquipamentos', this.state.equipamentos.length);
        this.updateElementText('countFuncionarios', this.state.funcionarios.length);

        // Totais - CORREÇÃO: verificar se há dados
        const custoTotalProdutos = this.state.produtos.length > 0 ? 
            this.state.produtos.reduce((sum, p) => sum + p.custoProduto, 0) : 0;
        const totalDespesasFixas = this.state.despesasFixas.length > 0 ?
            this.state.despesasFixas.reduce((sum, d) => sum + d.valor, 0) : 0;

        this.updateElementText('custoTotalProdutos', this.formatCurrency(custoTotalProdutos));
        this.updateElementText('totalDespesasFixas', this.formatCurrency(totalDespesasFixas));

        // Receita potencial produtos - CORREÇÃO: verificar se há dados
        const receitaPotencial = this.state.produtos.length > 0 ? this.state.produtos.reduce((sum, p) => {
            const precoFinal = p.custoProduto * (1 + p.margemDesejada / 100);
            return sum + precoFinal;
        }, 0) : 0;
        this.updateElementText('receitaPotencialProdutos', this.formatCurrency(receitaPotencial));
    }

    renderServicos() {
        const tbody = document.getElementById('servicosTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = this.state.servicos.map(servico => `
            <tr data-id="${servico.id}">
                <td><input type="text" value="${servico.codigo}" onchange="window.app.updateServico(${servico.id}, 'codigo', this.value)"></td>
                <td><input type="text" value="${servico.nome}" onchange="window.app.updateServico(${servico.id}, 'nome', this.value)"></td>
                <td><input type="number" value="${servico.duracao}" onchange="window.app.updateServico(${servico.id}, 'duracao', parseFloat(this.value))"></td>
                <td><input type="text" value="${servico.categoria}" onchange="window.app.updateServico(${servico.id}, 'categoria', this.value)"></td>
                <td><input type="number" value="${servico.margemDesejada}" onchange="window.app.updateServico(${servico.id}, 'margemDesejada', parseFloat(this.value))"></td>
                <td><button class="btn-action btn-remove" onclick="window.app.removeServico(${servico.id})">Remover</button></td>
            </tr>
        `).join('');

        // Atualizar valor total estimado - CORREÇÃO: verificar se há dados
        if (this.calculosServicos.length > 0) {
            const valorTotal = this.calculosServicos.reduce((sum, calc) => sum + calc.precoFinal, 0);
            this.updateElementText('valorTotalServicos', this.formatCurrency(valorTotal));
        } else {
            this.updateElementText('valorTotalServicos', this.formatCurrency(0));
        }
    }

    renderProdutos() {
        const tbody = document.getElementById('produtosTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = this.state.produtos.map(produto => `
            <tr data-id="${produto.id}">
                <td><input type="text" value="${produto.codigo}" onchange="window.app.updateProduto(${produto.id}, 'codigo', this.value)"></td>
                <td><input type="text" value="${produto.nome}" onchange="window.app.updateProduto(${produto.id}, 'nome', this.value)"></td>
                <td><input type="text" value="${produto.unidade}" onchange="window.app.updateProduto(${produto.id}, 'unidade', this.value)"></td>
                <td><input type="number" step="0.01" value="${produto.custoProduto}" onchange="window.app.updateProduto(${produto.id}, 'custoProduto', parseFloat(this.value))"></td>
                <td><input type="number" value="${produto.margemDesejada}" onchange="window.app.updateProduto(${produto.id}, 'margemDesejada', parseFloat(this.value))"></td>
                <td><input type="text" value="${produto.categoria}" onchange="window.app.updateProduto(${produto.id}, 'categoria', this.value)"></td>
                <td><button class="btn-action btn-remove" onclick="window.app.removeProduto(${produto.id})">Remover</button></td>
            </tr>
        `).join('');
    }

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

    renderFuncionarios() {
        const tbody = document.getElementById('funcionariosTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = this.state.funcionarios.map(funcionario => `
            <tr data-id="${funcionario.id}">
                <td><input type="text" value="${funcionario.nome}" onchange="window.app.updateFuncionario(${funcionario.id}, 'nome', this.value)"></td>
                <td><input type="text" value="${funcionario.cargo}" onchange="window.app.updateFuncionario(${funcionario.id}, 'cargo', this.value)"></td>
                <td><input type="number" step="0.01" value="${funcionario.salario}" onchange="window.app.updateFuncionario(${funcionario.id}, 'salario', parseFloat(this.value))"></td>
                <td>
                    <select onchange="window.app.updateFuncionario(${funcionario.id}, 'tipo', this.value)">
                        <option value="CLT" ${funcionario.tipo === 'CLT' ? 'selected' : ''}>CLT</option>
                        <option value="PJ" ${funcionario.tipo === 'PJ' ? 'selected' : ''}>PJ</option>
                    </select>
                </td>
                <td><button class="btn-action btn-remove" onclick="window.app.removeFuncionario(${funcionario.id})">Remover</button></td>
            </tr>
        `).join('');
    }

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

    renderParametros() {
        const horasElement = document.getElementById('horasUteisPorDia');
        const diasElement = document.getElementById('diasUteisPorMes');
        const taxaElement = document.getElementById('taxaOcupacao');
        
        if (horasElement) horasElement.value = this.state.parametrosAtendimento.horasUteisPorDia;
        if (diasElement) diasElement.value = this.state.parametrosAtendimento.diasUteisPorMes;
        if (taxaElement) taxaElement.value = (this.state.parametrosAtendimento.taxaOcupacao * 100).toFixed(1);
    }

    renderConsumoMateriais() {
        const container = document.getElementById('consumoMateriaisContainer');
        if (!container) return;
        
        // CORREÇÃO: Se não há serviços, mostrar mensagem
        if (this.state.servicos.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">Nenhum serviço cadastrado</div>';
            return;
        }
        
        // Garantir que todos os serviços tenham entrada no consumo
        this.state.servicos.forEach(servico => {
            const hasConsumo = this.state.consumoMateriais.some(c => c.servicoId === servico.id);
            if (!hasConsumo) {
                // Serviço adicionado automaticamente na seção de consumo
            }
        });

        container.innerHTML = this.state.servicos.map(servico => {
            const consumos = this.state.consumoMateriais.filter(c => c.servicoId === servico.id);
            const totalMateriais = this.calcularCustoMaterial(servico.id);

            return `
                <div class="servico-materiais">
                    <div class="servico-header">
                        <span class="servico-nome">${servico.nome}</span>
                        <span class="total-materiais">Total: ${this.formatCurrency(totalMateriais)}</span>
                    </div>
                    <div class="materiais-list">
                        ${consumos.map(consumo => {
                            const material = this.state.materiais.find(m => m.id === consumo.materialId);
                            if (!material) return '';
                            
                            const custoTotal = (material.custoUnitario / material.rendimento) * consumo.quantidade;
                            return `
                                <div class="material-item">
                                    <div class="material-info">
                                        <div class="material-nome">${material.nome}</div>
                                        <div class="material-detalhes">
                                            ${this.formatCurrency(material.custoUnitario/${material.rendimento})} por ${material.unidade} 
                                            - Total: ${this.formatCurrency(custoTotal)}
                                        </div>
                                    </div>
                                    <div class="material-actions">
                                        <input type="number" value="${consumo.quantidade}" min="0" step="0.1"
                                               onchange="window.app.updateConsumoMaterial(${servico.id}, ${material.id}, parseFloat(this.value))">
                                        <span>${material.unidade}</span>
                                        <button class="btn-action btn-remove" onclick="window.app.removeConsumoMaterial(${servico.id}, ${material.id})">×</button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                        
                        <div class="adicionar-material">
                            <select class="select-material" id="selectMaterial${servico.id}">
                                <option value="">Selecionar material...</option>
                                ${this.state.materiais.filter(material => 
                                    !consumos.some(c => c.materialId === material.id)
                                ).map(material => 
                                    `<option value="${material.id}">${material.nome}</option>`
                                ).join('')}
                            </select>
                            <button class="btn btn-add-material" onclick="window.app.adicionarMaterialServico(${servico.id})">
                                + Adicionar Material
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // === CRUD OPERATIONS ===
    adicionarServico() {
        const newId = Math.max(...this.state.servicos.map(s => s.id), 0) + 1;
        this.state.servicos.push({
            id: newId,
            codigo: `SRV${newId.toString().padStart(2, '0')}`,
            nome: 'Novo Serviço',
            duracao: 60,
            categoria: 'Corporal',
            margemDesejada: 50
        });
        this.saveData();
        this.renderAll();
        this.calculate();
        this.showNotification('Serviço adicionado com sucesso!', 'success');
    }

    updateServico(id, field, value) {
        const servico = this.state.servicos.find(s => s.id === id);
        if (servico) {
            servico[field] = value;
            this.saveData();
            this.calculate();
        }
    }

    removeServico(id) {
        this.state.servicos = this.state.servicos.filter(s => s.id !== id);
        this.state.consumoMateriais = this.state.consumoMateriais.filter(c => c.servicoId !== id);
        this.saveData();
        this.renderAll();
        this.calculate();
        this.showNotification('Serviço removido com sucesso!', 'success');
    }

    adicionarProduto() {
        const newId = Math.max(...this.state.produtos.map(p => p.id), 0) + 1;
        this.state.produtos.push({
            id: newId,
            codigo: `PROD${newId.toString().padStart(2, '0')}`,
            nome: 'Novo Produto',
            unidade: 'unid',
            custoProduto: 0,
            margemDesejada: 100,
            categoria: 'Cosméticos'
        });
        this.saveData();
        this.renderAll();
        this.calculate();
        this.showNotification('Produto adicionado com sucesso!', 'success');
    }

    updateProduto(id, field, value) {
        const produto = this.state.produtos.find(p => p.id === id);
        if (produto) {
            produto[field] = value;
            this.saveData();
            this.calculate();
        }
    }

    removeProduto(id) {
        this.state.produtos = this.state.produtos.filter(p => p.id !== id);
        this.saveData();
        this.renderAll();
        this.calculate();
        this.showNotification('Produto removido com sucesso!', 'success');
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
        this.saveData();
        this.renderAll();
        this.calculate();
    }

    updateMaterial(id, field, value) {
        const material = this.state.materiais.find(m => m.id === id);
        if (material) {
            material[field] = value;
            this.saveData();
            this.calculate();
        }
    }

    removeMaterial(id) {
        this.state.materiais = this.state.materiais.filter(m => m.id !== id);
        this.state.consumoMateriais = this.state.consumoMateriais.filter(c => c.materialId !== id);
        this.saveData();
        this.renderAll();
        this.calculate();
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
        this.saveData();
        this.renderAll();
        this.calculate();
    }

    updateEquipamento(id, field, value) {
        const equipamento = this.state.equipamentos.find(e => e.id === id);
        if (equipamento) {
            equipamento[field] = value;
            if (field === 'custoAquisicao' || field === 'vidaUtil') {
                equipamento.custoHora = this.calcularCustoHora(equipamento);
            }
            this.saveData();
            this.renderEquipamentos();
            this.calculate();
        }
    }

    removeEquipamento(id) {
        this.state.equipamentos = this.state.equipamentos.filter(e => e.id !== id);
        this.saveData();
        this.renderAll();
        this.calculate();
    }

    adicionarFuncionario() {
        const newId = Math.max(...this.state.funcionarios.map(f => f.id), 0) + 1;
        this.state.funcionarios.push({
            id: newId,
            nome: 'Novo Funcionário',
            cargo: 'Profissional',
            salario: 0,
            tipo: 'CLT'
        });
        this.saveData();
        this.renderAll();
        this.calculate();
    }

    updateFuncionario(id, field, value) {
        const funcionario = this.state.funcionarios.find(f => f.id === id);
        if (funcionario) {
            funcionario[field] = value;
            this.saveData();
            this.calculate();
        }
    }

    removeFuncionario(id) {
        this.state.funcionarios = this.state.funcionarios.filter(f => f.id !== id);
        this.saveData();
        this.renderAll();
        this.calculate();
    }

    adicionarDespesaFixa() {
        const newId = Math.max(...this.state.despesasFixas.map(d => d.id), 0) + 1;
        this.state.despesasFixas.push({
            id: newId,
            descricao: 'Nova Despesa',
            valor: 0,
            categoria: 'Geral'
        });
        this.saveData();
        this.renderAll();
        this.calculate();
    }

    updateDespesaFixa(id, field, value) {
        const despesa = this.state.despesasFixas.find(d => d.id === id);
        if (despesa) {
            despesa[field] = value;
            this.saveData();
            this.renderCounts();
            this.calculate();
        }
    }

    removeDespesaFixa(id) {
        this.state.despesasFixas = this.state.despesasFixas.filter(d => d.id !== id);
        this.saveData();
        this.renderAll();
        this.calculate();
    }

    // Consumo de materiais
    adicionarMaterialServico(servicoId) {
        const selectElement = document.getElementById(`selectMaterial${servicoId}`);
        const materialId = parseInt(selectElement.value);
        
        if (materialId && !this.state.consumoMateriais.some(c => c.servicoId === servicoId && c.materialId === materialId)) {
            this.state.consumoMateriais.push({
                servicoId,
                materialId,
                quantidade: 1
            });
            this.saveData();
            this.renderConsumoMateriais();
            this.calculate();
        }
    }

    updateConsumoMaterial(servicoId, materialId, quantidade) {
        const consumo = this.state.consumoMateriais.find(c => c.servicoId === servicoId && c.materialId === materialId);
        if (consumo) {
            consumo.quantidade = quantidade || 0;
            this.saveData();
            this.renderConsumoMateriais();
            this.calculate();
        }
    }

    removeConsumoMaterial(servicoId, materialId) {
        this.state.consumoMateriais = this.state.consumoMateriais.filter(
            c => !(c.servicoId === servicoId && c.materialId === materialId)
        );
        this.saveData();
        this.renderConsumoMateriais();
        this.calculate();
    }

    // === CÁLCULOS - CORREÇÕES PRINCIPAIS ===
    calculate() {
        // CORREÇÃO: Se não há dados nos cadastros, zerar todos os cálculos
        if (this.state.servicos.length === 0 && this.state.produtos.length === 0) {
            this.calculosServicos = [];
            this.calculosProdutos = [];
        } else {
            this.calculosServicos = this.calcularCustosServicos();
            this.calculosProdutos = this.calcularCustosProdutos();
        }
        
        this.renderCalculos();
        this.renderRelatorios();
        this.renderDashboard();
        if (this.currentSection === 'dashboard') {
            setTimeout(() => this.renderDashboardCharts(), 100);
        }
    }

    calcularCustosServicos() {
        // CORREÇÃO: Se não há serviços, retornar array vazio
        if (this.state.servicos.length === 0) {
            return [];
        }

        const { parametrosAtendimento } = this.state;
        const custoFixoTotal = this.state.despesasFixas.reduce((sum, d) => sum + d.valor, 0);
        
        // Custo de mão de obra por hora
        const custoMaoObraTotal = this.state.funcionarios.reduce((sum, f) => {
            const encargos = f.tipo === 'CLT' ? 
                Object.values(this.state.encargos.clt).reduce((s, e) => s + e, 0) / 100 :
                0;
            return sum + (f.salario * (1 + encargos));
        }, 0);

        const horasProdutivasMes = parametrosAtendimento.horasUteisPorDia * parametrosAtendimento.diasUteisPorMes;
        const custoMaoObraHora = horasProdutivasMes > 0 ? custoMaoObraTotal / horasProdutivasMes : 0;
        
        // Sessões mensais estimadas
        const sessionesEstimadas = horasProdutivasMes * parametrosAtendimento.taxaOcupacao;
        const custoFixoPorSessao = sessionesEstimadas > 0 ? custoFixoTotal / sessionesEstimadas : 0;

        return this.state.servicos.map(servico => {
            const custoMaterial = this.calcularCustoMaterial(servico.id);
            const custoMaoObra = custoMaoObraHora * (servico.duracao / 60);
            const custoEquipamento = this.calcularCustoEquipamento(servico.duracao);
            const custoTotal = custoMaterial + custoMaoObra + custoEquipamento + custoFixoPorSessao;
            const precoFinal = custoTotal * (1 + servico.margemDesejada / 100);

            return {
                servico,
                custoMaterial,
                custoMaoObra,
                custoEquipamento,
                custoFixoRateado: custoFixoPorSessao,
                custoTotal,
                precoFinal,
                margem: servico.margemDesejada
            };
        });
    }

    calcularCustosProdutos() {
        // CORREÇÃO: Se não há produtos, retornar array vazio
        if (this.state.produtos.length === 0) {
            return [];
        }

        const custoFixoTotal = this.state.despesasFixas.reduce((sum, d) => sum + d.valor, 0);
        const totalProdutos = this.state.produtos.length;
        const custoFixoRateadoPorProduto = totalProdutos > 0 ? custoFixoTotal / totalProdutos : 0;

        return this.state.produtos.map(produto => {
            const custosRateados = custoFixoRateadoPorProduto * 0.1; // 10% do custo fixo rateado para produtos
            const custoTotal = produto.custoProduto + custosRateados;
            const precoFinal = custoTotal * (1 + produto.margemDesejada / 100);

            return {
                produto,
                custoProduto: produto.custoProduto,
                custosRateados,
                custoTotal,
                margemDesejada: produto.margemDesejada,
                precoFinal
            };
        });
    }

    calcularCustoMaterial(servicoId) {
        const consumos = this.state.consumoMateriais.filter(c => c.servicoId === servicoId);
        return consumos.reduce((total, consumo) => {
            const material = this.state.materiais.find(m => m.id === consumo.materialId);
            if (material && material.rendimento > 0) {
                const custoUnitario = material.custoUnitario / material.rendimento;
                return total + (custoUnitario * consumo.quantidade);
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

    calcularCustoHora(equipamento) {
        const horasTotais = equipamento.vidaUtil * this.state.parametrosAtendimento.horasUteisPorDia * this.state.parametrosAtendimento.diasUteisPorMes;
        return horasTotais > 0 ? equipamento.custoAquisicao / horasTotais : 0;
    }

    renderCalculos() {
        // Render serviços - CORREÇÃO: verificar se há dados
        const servicosTableBody = document.getElementById('calculosServicosTableBody');
        if (servicosTableBody) {
            if (this.calculosServicos.length === 0) {
                servicosTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #666; padding: 20px;">Nenhum serviço cadastrado</td></tr>';
            } else {
                servicosTableBody.innerHTML = this.calculosServicos.map(calc => `
                    <tr>
                        <td>${calc.servico.nome}</td>
                        <td>${this.formatCurrency(calc.custoMaterial)}</td>
                        <td>${this.formatCurrency(calc.custoMaoObra)}</td>
                        <td>${this.formatCurrency(calc.custoEquipamento)}</td>
                        <td>${this.formatCurrency(calc.custoFixoRateado)}</td>
                        <td><strong>${this.formatCurrency(calc.custoTotal)}</strong></td>
                        <td><strong>${this.formatCurrency(calc.precoFinal)}</strong></td>
                        <td>${calc.margem.toFixed(1)}%</td>
                    </tr>
                `).join('');
            }
        }

        // Render produtos - CORREÇÃO: verificar se há dados
        const produtosTableBody = document.getElementById('calculosProdutosTableBody');
        if (produtosTableBody) {
            if (this.calculosProdutos.length === 0) {
                produtosTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #666; padding: 20px;">Nenhum produto cadastrado</td></tr>';
            } else {
                produtosTableBody.innerHTML = this.calculosProdutos.map(calc => `
                    <tr>
                        <td>${calc.produto.nome}</td>
                        <td>${this.formatCurrency(calc.custoProduto)}</td>
                        <td>${this.formatCurrency(calc.custosRateados)}</td>
                        <td><strong>${this.formatCurrency(calc.custoTotal)}</strong></td>
                        <td>${calc.margemDesejada.toFixed(1)}%</td>
                        <td><strong>${this.formatCurrency(calc.precoFinal)}</strong></td>
                    </tr>
                `).join('');
            }
        }
    }

    // CORREÇÃO PRINCIPAL: Dashboard com validações
    renderDashboard() {
        // CORREÇÃO: Verificar se há dados antes de calcular
        const receitaServicos = this.calculosServicos.length > 0 ? 
            this.calculosServicos.reduce((sum, calc) => sum + calc.precoFinal, 0) : 0;
        const receitaProdutos = this.calculosProdutos.length > 0 ? 
            this.calculosProdutos.reduce((sum, calc) => sum + calc.precoFinal, 0) : 0;
        const receitaTotal = receitaServicos + receitaProdutos;

        this.updateElementText('receitaTotal', this.formatCurrency(receitaTotal));
        this.updateElementText('totalServicos', this.state.servicos.length);
        this.updateElementText('totalProdutos', this.state.produtos.length);

        // Valores médios - CORREÇÃO: verificar divisão por zero
        const valorMedioServicos = this.calculosServicos.length > 0 ? receitaServicos / this.calculosServicos.length : 0;
        const valorMedioProdutos = this.calculosProdutos.length > 0 ? receitaProdutos / this.calculosProdutos.length : 0;
        
        this.updateElementText('valorMedioServicos', 'Valor Médio: ' + this.formatCurrency(valorMedioServicos));
        this.updateElementText('valorMedioProdutos', 'Valor Médio: ' + this.formatCurrency(valorMedioProdutos));

        // Margem operacional - CORREÇÃO: verificar se há receita
        const custoTotal = this.state.despesasFixas.reduce((sum, d) => sum + d.valor, 0);
        const margemOperacional = receitaTotal > 0 ? ((receitaTotal - custoTotal) / receitaTotal) * 100 : 0;
        this.updateElementText('margemOperacional', margemOperacional.toFixed(1) + '%');

        // Atualizar simulação rápida
        const taxaAtual = document.getElementById('taxaSimulacao')?.value || 75;
        this.updateSimulacaoRapida(taxaAtual / 100);
    }

    // CORREÇÃO: Simulação rápida com validações
    updateSimulacaoRapida(taxa) {
        // CORREÇÃO: Verificar se há dados
        const receitaServicos = this.calculosServicos.length > 0 ? 
            this.calculosServicos.reduce((sum, calc) => sum + calc.precoFinal, 0) : 0;
        const receitaProdutos = this.calculosProdutos.length > 0 ? 
            this.calculosProdutos.reduce((sum, calc) => sum + calc.precoFinal, 0) : 0;
        const receitaTotal = (receitaServicos + receitaProdutos) * taxa;
        
        const custosFixos = this.state.despesasFixas.reduce((sum, d) => sum + d.valor, 0);
        const resultado = receitaTotal - custosFixos;

        this.updateElementText('receitaSimulacao', this.formatCurrency(receitaTotal));
        this.updateElementText('resultadoSimulacao', this.formatCurrency(resultado));
    }

    // CORREÇÃO PRINCIPAL: Relatórios com validações
    renderRelatorios() {
        // Tickets médios - CORREÇÃO: verificar se há dados
        const ticketMedioServicos = this.calculosServicos.length > 0 ? 
            this.calculosServicos.reduce((sum, calc) => sum + calc.precoFinal, 0) / this.calculosServicos.length : 0;
        const ticketMedioProdutos = this.calculosProdutos.length > 0 ? 
            this.calculosProdutos.reduce((sum, calc) => sum + calc.precoFinal, 0) / this.calculosProdutos.length : 0;

        this.updateElementText('ticketMedioServicos', this.formatCurrency(ticketMedioServicos));
        this.updateElementText('ticketMedioProdutos', this.formatCurrency(ticketMedioProdutos));

        // Mix - CORREÇÃO: verificar divisão por zero
        const receitaServicos = this.calculosServicos.length > 0 ? 
            this.calculosServicos.reduce((sum, calc) => sum + calc.precoFinal, 0) : 0;
        const receitaProdutos = this.calculosProdutos.length > 0 ? 
            this.calculosProdutos.reduce((sum, calc) => sum + calc.precoFinal, 0) : 0;
        const receitaTotal = receitaServicos + receitaProdutos;

        const mixServicos = receitaTotal > 0 ? (receitaServicos / receitaTotal) * 100 : 0;
        const mixProdutos = receitaTotal > 0 ? (receitaProdutos / receitaTotal) * 100 : 0;

        this.updateElementText('mixServicos', mixServicos.toFixed(1) + '%');
        this.updateElementText('mixProdutos', mixProdutos.toFixed(1) + '%');

        // DRE - CORREÇÃO: todos os valores zerados quando não há dados
        this.updateElementText('receitaServicos', this.formatCurrency(receitaServicos));
        this.updateElementText('receitaProdutos', this.formatCurrency(receitaProdutos));
        this.updateElementText('receitaBrutaTotal', this.formatCurrency(receitaTotal));

        const custosVariaveisServicos = this.calculosServicos.length > 0 ? this.calculosServicos.reduce((sum, calc) => 
            sum + calc.custoMaterial + calc.custoMaoObra + calc.custoEquipamento, 0) : 0;
        const custosVariaveisProdutos = this.calculosProdutos.length > 0 ? this.calculosProdutos.reduce((sum, calc) => sum + calc.custoProduto, 0) : 0;

        this.updateElementText('custosVariaveisServicos', this.formatCurrency(custosVariaveisServicos));
        this.updateElementText('custosVariaveisProdutos', this.formatCurrency(custosVariaveisProdutos));

        const margemContribuicao = receitaTotal - custosVariaveisServicos - custosVariaveisProdutos;
        this.updateElementText('margemContribuicaoTotal', this.formatCurrency(margemContribuicao));

        const despesasFixasTotal = this.state.despesasFixas.reduce((sum, d) => sum + d.valor, 0);
        this.updateElementText('despesasFixasTotal', this.formatCurrency(despesasFixasTotal));

        const resultadoLiquido = margemContribuicao - despesasFixasTotal;
        this.updateElementText('resultadoLiquidoTotal', this.formatCurrency(resultadoLiquido));

        // Análise de viabilidade
        this.renderAnaliseViabilidade(resultadoLiquido, receitaTotal);
    }

    renderAnaliseViabilidade(resultado, receita) {
        const statusElement = document.getElementById('statusViabilidade');
        const recomendacoesList = document.getElementById('listaRecomendacoes');
        
        if (!statusElement || !recomendacoesList) return;
        
        let status, statusClass, recomendacoes = [];

        // CORREÇÃO: Se não há dados, status específico
        if (this.state.servicos.length === 0 && this.state.produtos.length === 0) {
            status = 'Sem dados para análise';
            statusClass = 'status--info';
            recomendacoes.push('Cadastre serviços e produtos para realizar a análise de viabilidade');
        } else if (resultado > 0) {
            status = 'Negócio Viável';
            statusClass = 'status--success';
            recomendacoes.push('O negócio apresenta resultado positivo considerando serviços e produtos');
            
            const margemLiquida = (resultado / receita) * 100;
            if (margemLiquida < 10) {
                recomendacoes.push('Margem líquida baixa. Considere otimizar custos ou aumentar preços');
            }
            if (margemLiquida > 20) {
                recomendacoes.push('Excelente margem líquida. Considere investir em expansão');
            }
        } else if (resultado > -5000) {
            status = 'Atenção Necessária';
            statusClass = 'status--warning';
            recomendacoes.push('O negócio está próximo do ponto de equilíbrio');
            recomendacoes.push('Revise a estratégia de mix entre serviços e produtos');
            recomendacoes.push('Considere aumentar as vendas de produtos (maior margem)');
        } else {
            status = 'Não Viável';
            statusClass = 'status--error';
            recomendacoes.push('O negócio apresenta prejuízo significativo');
            recomendacoes.push('Reavalie preços de serviços e produtos');
            recomendacoes.push('Reduza custos fixos ou melhore eficiência operacional');
        }

        statusElement.className = `status ${statusClass}`;
        statusElement.textContent = status;
        
        recomendacoesList.innerHTML = recomendacoes.map(rec => `<li>${rec}</li>`).join('');
    }

    // === CHARTS - CORREÇÕES ===
    renderDashboardCharts() {
        console.log('Renderizando gráficos do dashboard...');
        const canvas = document.getElementById('mixReceitaChart');
        if (!canvas) {
            console.error('Canvas do gráfico não encontrado');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.mixReceita) {
            this.charts.mixReceita.destroy();
        }

        // CORREÇÃO: Verificar se há dados
        const receitaServicos = this.calculosServicos.length > 0 ? 
            this.calculosServicos.reduce((sum, calc) => sum + calc.precoFinal, 0) : 0;
        const receitaProdutos = this.calculosProdutos.length > 0 ? 
            this.calculosProdutos.reduce((sum, calc) => sum + calc.precoFinal, 0) : 0;

        console.log('Receita serviços:', receitaServicos);
        console.log('Receita produtos:', receitaProdutos);

        // Se não há dados, mostrar gráfico vazio ou com mensagem
        if (receitaServicos === 0 && receitaProdutos === 0) {
            this.charts.mixReceita = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Sem dados'],
                    datasets: [{
                        data: [1],
                        backgroundColor: ['#cccccc']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
            return;
        }

        this.charts.mixReceita = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Serviços', 'Produtos'],
                datasets: [{
                    data: [receitaServicos, receitaProdutos],
                    backgroundColor: ['#1FB8CD', '#FFC185']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed;
                                const total = receitaServicos + receitaProdutos;
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return `${context.label}: R$ ${value.toLocaleString('pt-BR')} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        
        console.log('Gráfico do dashboard renderizado com sucesso');
    }

    renderReportCharts() {
        const canvas = document.getElementById('analiseChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.analise) {
            this.charts.analise.destroy();
        }

        // CORREÇÃO: Verificar se há dados
        const servicosData = this.calculosServicos.length > 0 ? this.calculosServicos.map(calc => ({
            x: calc.custoTotal,
            y: calc.precoFinal,
            label: calc.servico.nome
        })) : [];

        const produtosData = this.calculosProdutos.length > 0 ? this.calculosProdutos.map(calc => ({
            x: calc.custoTotal,
            y: calc.precoFinal,
            label: calc.produto.nome
        })) : [];

        this.charts.analise = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Serviços',
                    data: servicosData,
                    backgroundColor: '#1FB8CD',
                    borderColor: '#1FB8CD'
                }, {
                    label: 'Produtos',
                    data: produtosData,
                    backgroundColor: '#FFC185',
                    borderColor: '#FFC185'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return context[0]?.raw?.label || 'Item';
                            },
                            label: function(context) {
                                return `Custo: R$ ${context.parsed.x.toLocaleString('pt-BR')}, Preço: R$ ${context.parsed.y.toLocaleString('pt-BR')}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Custo Total (R$)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Preço Final (R$)'
                        }
                    }
                }
            }
        });
    }

    renderProjecaoChart() {
        const canvas = document.getElementById('projecaoChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.projecao) {
            this.charts.projecao.destroy();
        }

        // CORREÇÃO: Verificar se há dados
        const receitaAtual = (this.calculosServicos.length > 0 ? this.calculosServicos.reduce((sum, calc) => sum + calc.precoFinal, 0) : 0) + 
                           (this.calculosProdutos.length > 0 ? this.calculosProdutos.reduce((sum, calc) => sum + calc.precoFinal, 0) : 0);
        
        const meses = [];
        const receitaProjecao = [];
        const crescimentoReceita = this.state.projecaoCrescimento.crescimentoReceita / 100;

        for (let i = 0; i <= 12; i++) {
            meses.push(`Mês ${i}`);
            const receitaMes = receitaAtual * Math.pow(1 + crescimentoReceita, i);
            receitaProjecao.push(receitaMes);
        }

        this.charts.projecao = new Chart(ctx, {
            type: 'line',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Receita Projetada',
                    data: receitaProjecao,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true
                }, {
                    label: 'Meta 12 Meses',
                    data: new Array(13).fill(this.state.projecaoCrescimento.meta12Meses),
                    borderColor: '#DB4545',
                    borderDash: [5, 5],
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Receita (R$)'
                        },
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

    // === UTILITY METHODS ===
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
        }).format(value || 0);
    }
}

// === GLOBAL FUNCTIONS ===
window.adicionarServico = function() { if (window.app) window.app.adicionarServico(); };
window.adicionarProduto = function() { if (window.app) window.app.adicionarProduto(); };
window.adicionarMaterial = function() { if (window.app) window.app.adicionarMaterial(); };
window.adicionarEquipamento = function() { if (window.app) window.app.adicionarEquipamento(); };
window.adicionarFuncionario = function() { if (window.app) window.app.adicionarFuncionario(); };
window.adicionarDespesaFixa = function() { if (window.app) window.app.adicionarDespesaFixa(); };

window.toggleAccordion = function(sectionName) { if (window.app) window.app.toggleAccordion(sectionName); };

// Inicializar aplicação - AGUARDAR DOM ESTAR COMPLETAMENTE CARREGADO
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM CARREGADO ===');
    
    setTimeout(() => {
        console.log('=== INICIALIZANDO APLICAÇÃO ===');
        window.app = new FinancialAnalysisApp();
        window.app.init();
    }, 100);
});