# 🧠 Classificador de Imagens e Análise de Viés em IA (Empresários vs. CLT's)

## 📝 Descrição do Projeto
Este projeto consiste no desenvolvimento e análise de um modelo de classificação binária de imagens utilizando a ferramenta **Teachable Machine** (da Google). O objetivo principal foi treinar uma inteligência artificial para distinguir entre duas classes sociais/profissionais hipotéticas: **"Empresários"** e **"CLT's"**, com base em características visuais de indivíduos.

O projeto foi desenvolvido por **Fabricio Duarte Santos** (Matrícula: 48200425) como parte da resolução da Atividade 2 da disciplina. Mais do que construir um classificador funcional, o escopo do trabalho envolveu uma análise crítica sobre o processo de aprendizado de máquina, identificando como restrições e padrões nos dados de treino podem forçar a IA a adotar vieses preconceituosos baseados em características físicas.

* **Link do Modelo Online:** [Acessar Teachable Machine](https://teachablemachine.withgoogle.com/models/1csah93fn/)

---

## ⚙️ Arquitetura do Modelo e Treinamento

O modelo foi construído utilizando uma rede neural convolucional adaptada via *Transfer Learning* na interface do Teachable Machine.

### Configuração dos Hiperparâmetros
* **Epochs (Épocas):** 50
* **Batch Size (Tamanho do Lote):** 16
* **Learning Rate (Taxa de Aprendizado):** 0.001

### Estrutura das Classes e Dataset
O conjunto de dados foi composto por amostras de imagem de colegas de turma, distribuídas da seguinte forma:

| Classe | Quantidade de Amostras | Características Predominantes no Treino |
| :--- | :--- | :--- |
| **Empresários** | 10 amostras | Semblantes sérios, roupas de cores neutras e menos estampadas. |
| **CLT's** | 10 amostras | Semblantes alegres, roupas divergentes e estampadas. |

---

## 📊 Resultados e Análise de Viés

### Desempenho do Modelo
Em testes com imagens com características bem delimitadas, o modelo apresentou forte convicção. Como demonstrado na interface, ao analisar um indivíduo com semblante alegre e trajes casuais, o sistema gerou a seguinte saída:
* **CLT's:** `86%` de confiança
* **Empresários:** `14%` de confiança

### O Problema do Viés Cognitivo e Algorítmico (Bias)
O principal aprendizado deste projeto envolveu o comportamento do sistema diante de dados ambíguos. Ao introduzir uma imagem que misturava características de ambas as classes, o programa apresentou divergências. 

> ⚠️ **Reflexão Crítica:** Ao "cercar" a IA e forçá-la a encontrar padrões de semelhança em um dataset limitado, o sistema passa a correlacionar classes a variáveis irrelevantes e sensíveis, como **penteado, etnia e sexo**. Esse fenômeno transforma uma classificação puramente comportamental/indumentária em uma prática de **viés preconceituoso**, evidenciando os perigos de triagens automatizadas por características físicas.

---

## 🔧 Conclusão e Próximos Passos

O projeto comprova que a inteligência artificial não possui discernimento moral próprio e apenas replica padrões matemáticos contidos nos dados. 

Para mitigar esses problemas, destaca-se que:
1. Há uma necessidade indispensável de **colaboração humana contínua** no refinamento e supervisão do trabalho da IA.
2. A diversificação do dataset de treino é essencial para mitigar "preconceitos" algorítmicos e estimular um aprendizado verdadeiramente robusto e ético do sistema.

---
[🏠 Voltar ao Portfólio](https://github.com/FabDuartZL/portfolio-fabricio-duarte-santos)
