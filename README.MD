# A aplicação

A aplicação possui três funcionalidades, a de pomodoro, timer e stopwatch.

![foto da aplicação](https://i.pinimg.com/originals/58/4d/0e/584d0e5f50c810ceab4dc7d4ce1be2e4.jpg)

# Objetivo

A aplicação foi feita com o intuito de colocar em prática as diversas formas de se aplicar a *herança prototípica* do Javascript, o uso de *funções construtoras* e outras funcionalidade que implicam o uso de **this**.

## Atributos aria

A aplicação possui uma pequena melhoria para *acessibilidade* com o uso dos atributos **aria**. Como por exemplo, as roles **alert** e **progress-bar**, que mantêm uma atualização *auditiva* e *visual* do progresso do relógio em execução.

## Object.create(..)

A primeira forma utilizada usa apenas objetos junto ao **Object.create(..)**, seguindo a ideia de composição, que diferente das *classes* cria-se objetos a partir do que eles fazem, e não do que são. Por exemplo, todos os tipos de relógios da aplicação, precisam iniciar e parar suas operações, então, é criado um objeto clock padrão, que possui os métodos *.start()* e *.stop()*, que serão usados por todos os relógios a partir de uma **factory function**.

## Classes

A segunda forma utilizada usa de *classes* para gerar a "herança" de objetos, mas para cada relógio, é criada uma classe diferente, e a principal diferença entre o uso da *composição* e de *classes* é que com a composição, os objetos só requerem as funcionalidades que farão uso, e não todo um objeto. Como por exemplo, caso haja a necessidade de um relógio que não precisa ser parado, haverá dois objetos diferentes, um com a funcionalidade de parar o relógio, e outro com a de iniciar, assim, o novo relógio pode apenas não herdar o objeto com a funcionalidade de *.stop()*, desse modo, cada relógio, é composto de vários objetos que possuem as funcionalidades necessárias.

## Funções construtoras

A terceira forma usa de *funções construtoras*, junto ao operador **new** para criar objetos ligados a um prototype definido. Nesta forma é utilizado também os métodos **Object.create(..)** e **.call(..)** parar herdar outro prototype e propriedades de outras funções. No final, essa forma apenas imita o uso de classes, porém de uma forma mais trabalhosa.
