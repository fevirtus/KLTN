const { convertToAge, validatePet } = require("../src/network/common")

//test convertToAge ------------

it('empty', () => {
    const expected = 'N/A'
    expect(convertToAge()).toEqual(expected)
})

it('null', () => {
    const expected = 'N/A'
    const input = null
    expect(convertToAge(input)).toEqual(expected)
})

it('empty', () => {
    const expected = 'N/A'
    const input = ''
    expect(convertToAge(input)).toEqual(expected)
})

it('days', () => {
    const expected = '22 days'
    const input = '2020-08-08'
    expect(convertToAge(input)).toEqual(expected)
})

it('month', () => {
    const expected = 'a month'
    const input = '2020-07-29'
    expect(convertToAge(input)).toEqual(expected)
})

it('months', () => {
    const expected = '3 months'
    const input = '2020-05-28'
    expect(convertToAge(input)).toEqual(expected)
})

it('year', () => {
    const expected = 'a year'
    const input = '2019-07-29'
    expect(convertToAge(input)).toEqual(expected)
})

it('years', () => {
    const expected = '3 years'
    const input = '2017-05-28'
    expect(convertToAge(input)).toEqual(expected)
})

it('format', () => {
    const expected = '3 years'
    const input = '2017/05/28'
    expect(convertToAge(input)).toEqual(expected)
})

it('Invalid date', () => {
    const expected = 'Invalid date'
    const input = 'abc'
    expect(convertToAge(input)).toEqual(expected)
})

it('Invalid date', () => {
    const expected = 'Invalid date'
    const input = '2017 may, 28'
    expect(convertToAge(input)).toEqual(expected)
})

//test validatePet -----------------

it('InvalidName: empty', () => {
    const expected = false
    const input = {
        name: ''
    }
    expect(validatePet(input)).toEqual(expected)
})

it('InvalidName: null', () => {
    const expected = false
    const input = {
        name: null
    }
    expect(validatePet(input)).toEqual(expected)
})

it('InvalidName: length < 2', () => {
    const expected = false
    const input = {
        name: 'a'
    }
    expect(validatePet(input)).toEqual(expected)
})

it('InvalidName: length > 15', () => {
    const expected = false
    const input = {
        name: 'test test test test'
    }
    expect(validatePet(input)).toEqual(expected)
})

it('InvalidWeight: length > 3', () => {
    const expected = false
    const input = {
        name: 'Monday@@',
        weight: 3000
    }
    expect(validatePet(input)).toEqual(expected)
})

it('InvalidWeight: length > 3', () => {
    const expected = false
    const input = {
        name: 'Monday@@',
        weight: '999'
    }
    expect(validatePet(input)).toEqual(expected)
})

it('InvalidAvatar: null', () => {
    const expected = false
    const input = {
        name: 'Monday@@',
        weight: '999',
        avatar: null
    }
    expect(validatePet(input)).toEqual(expected)
})

it('InvalidAvatar: empty', () => {
    const expected = false
    const input = {
        name: 'Monday@@',
        weight: '999',
        avatar: ''
    }
    expect(validatePet(input)).toEqual(expected)
})

it('InvalidBreed: empty', () => {
    const expected = false
    const input = {
        name: 'Monday@@',
        weight: '999',
        avatar: 'abc.jpg',
        breed: ''
    }
    expect(validatePet(input)).toEqual(expected)
})

it('InvalidBreed: null', () => {
    const expected = false
    const input = {
        name: 'Monday@@',
        weight: '999',
        avatar: 'abc.jpg',
        breed: null
    }
    expect(validatePet(input)).toEqual(expected)
})

it('InvalidBreed: -1', () => {
    const expected = false
    const input = {
        name: 'Monday@@',
        weight: '999',
        avatar: 'abc.jpg',
        breed: -1
    }
    expect(validatePet(input)).toEqual(expected)
})

it('validPet', () => {
    const expected = true
    const input = {
        name: 'Monday@@',
        weight: '999',
        avatar: 'abc.jpg',
        breed: '11'
    }
    expect(validatePet(input)).toEqual(expected)
})
