/// <reference types="cypress" />

describe('Cypress Playground', () => {
  beforeEach(() => {
    const now = new Date(2024, 8, 18)// CONGELA NA DATA SETADA 18 de setembro de 2024
    cy.clock(now)
    cy.visit('https://cypress-playground.s3.eu-central-1.amazonaws.com/index.html')
  })

  it('Exibe um banner promocional', () => {
    cy.get('#promotional-banner > div').should('be.visible')

  })

  it('Clicando em elementos', () => {

    //cy.get('#click > button').click()
    cy.contains('button', 'Subscribe').click()

    //cy.get('#success').should('be.visible')
    cy.contains('span', "You've been successfully subscribed to our newsletter.").should('be.visible')

  });

  it('Digitando em campos', () => {

    cy.get('#signature-textarea').type('MstrHb')

    cy.contains('#signature', 'MstrHb').should('be.visible')

  });

  it('Marcando e desmarcando caixas de seleção', () => {

    cy.get('#signature-textarea-with-checkbox').type('MstrHb')
    cy.get('#signature-checkbox').check()

    cy.contains('#signature-triggered-by-check', 'MstrHb').should('be.visible')

    cy.get('#signature-checkbox').uncheck()

    cy.contains('#signature-triggered-by-check', 'MstrHb').should('not.exist')

  });

  it('Marcando _inputs_ do tipo', () => {

    cy.contains('#on-off', 'ON').should('be.visible')

    cy.get('#off').check()
    cy.contains('#on-off', 'OFF').should('be.visible')
    cy.contains('#on-off', 'ON').should('not.exist')

    cy.get('#on').check()
    cy.contains('#on-off', 'ON').should('be.visible')
    cy.contains('#on-off', 'OFF').should('not.exist')

  });

  it('Selecionando opções em campos de seleção suspensa', () => {

    cy.contains('p', "You haven't selected a type yet.").should('be.visible')

    //cy.get('#selection-type').select('vip')
    //cy.get('#selection-type').select('VIP')
    cy.get('#selection-type').select(3)

    cy.contains('p', "You've selected: VIP").should('be.visible')

  });

  it('Selecionando múltiplas opções em campos do tipo', () => {
    cy.contains('p', "You haven't selected any fruit yet.").should('be.visible')

    cy.get('#fruit').select(['apple', 'banana', 'cherry'])

    cy.contains('p', "You've selected the following fruits: apple, banana, cherry").should('be.visible')

  });

  it('Testando o _upload_ de arquivos', () => {

    cy.get('#file-upload').selectFile('./cypress/fixtures/example.json')

    cy.contains('p', 'The following file has been selected for upload: example.json').should('be.visible')

  });

  it('Interceptando e aguardando requisições que ocorrem à nível de rede', () => {

    cy.intercept('GET',
      'https://jsonplaceholder.typicode.com/todos/1'
    ).as('getTodo')

    cy.contains('button', 'Get TODO').click()
    cy.wait('@getTodo')
      .its('response.statusCode').should('eq', 200)

    cy.contains('li', 'TODO ID: 1').should('be.visible')
    cy.contains('li', 'Title: delectus aut autem').should('be.visible')
    cy.contains('li', 'Completed: false').should('be.visible')
    cy.contains('li', 'User ID: 1').should('be.visible')

  });

  it('obrescrevendo o resultado de uma requisição à nível de rede', () => {
    const todo = require('../fixtures/todo.json')
    cy.intercept('GET',
      'https://jsonplaceholder.typicode.com/todos/1',
      { fixture: 'todo' }
    ).as('getTodo')

    cy.contains('button', 'Get TODO').click()
    cy.wait('@getTodo')
      .its('response.statusCode').should('eq', 200)
    cy.contains('li', `TODO ID: ${todo.id}`).should('be.visible')
    cy.contains('li', `Title: ${todo.title}`).should('be.visible')
    cy.contains('li', `Completed: ${todo.completed}`).should('be.visible')
    cy.contains('li', `User ID: ${todo.userId}`).should('be.visible')
  });

  it('Simulando uma falha na API', () => {

    cy.intercept('GET',
      'https://jsonplaceholder.typicode.com/todos/1',
      { statusCode: 500 }).as('serverFailure')

    cy.contains('button', 'Get TODO').click()

    cy.wait('@serverFailure')
      .its('response.statusCode').should('eq', 500)

    cy.contains('span', 'Oops, something went wrong. Refresh the page and try again.').should('be.visible')

  });

  it('Simulando uma falha na rede', () => {

    cy.intercept('GET',
      'https://jsonplaceholder.typicode.com/todos/1',
      { forceNetworkError: true }).as('networkError')

    cy.contains('button', 'Get TODO').click()

    cy.wait('@networkError')

    cy.contains('span', 'Oops, something went wrong. Check your internet connection, refresh the page, and try again.').should('be.visible')

  });

  it('Criando um simples teste de API com Cypress', () => {

    cy.request('GET', 'https://jsonplaceholder.typicode.com/todos/1')
      .its('status').should('eq', 200)

  });

  Cypress._.times(10, index => {

    it(`selects ${index + 1} out of 10`, () => {
      cy.get('#level')
        .invoke('val', index + 1)
        .trigger('change')

      cy.contains('p', `You're on level: ${index + 1}`).should('be.visible')

    })
  })

  it('Lidando com _inputs_ do tipo _date', () => {

    cy.get('#date').type('1977-09-18').blur()

    cy.contains('p', "The date you've selected is: 1977-09-18").should('be.visible')

  });

  it('Protegendo dados sensíveis com Cypress', () => {
    cy.get('#password').type(Cypress.env('SENHA_SECRETA'), { log: false })//oculta a senha no log do cypress

    cy.get('#show-password-checkbox').check()

    cy.get('#password-input input[type="password"]').should('not.exist')
    cy.get('#password-input input[type="text"]').should('be.visible')
      .and('have.value', Cypress.env('SENHA_SECRETA'))

    cy.get('#show-password-checkbox').uncheck()

    cy.get('#password-input input[type="password"]').should('be.visible')
    cy.get('#password-input input[type="text"]').should('not.exist')

  });

  it('Contando itens com Cypress', () => {
    
    cy.get('ul#animals li').should('have.length', 5)
  });

  it('Congelando 🧊 o relógio ⌚ do navegador com Cypress', () => {
    
    cy.contains('p', 'Current date: 2024-09-18').should('be.visible')

  });

  it('Usando dados gerados pela aplicação coretamente', () => {
    cy.get('#timestamp')
    .then(element => {
      const code = element[0].innerText

      cy.get('#code').type(code)
      cy.contains('button', 'Submit').click()

      cy.contains("Congrats! You've entered the correct code.").should('be.visible')
    })

  });

  it('Usando dados gerados pela aplicação incoretamente', () => {
    
    cy.get('#code').type('123456789')
      cy.contains('button', 'Submit').click()

      cy.contains("The provided code isn't correct. Please, try again.").should('be.visible')
  });

  it('Testando a leitura de arquivos com Cypress', () => {
    
    cy.get('[href="data:,Hello%2C%20World%21"]').click()
    
    cy.readFile('cypress/downloads/example.txt')
      .should('eq', 'Hello, World!')
  });

})