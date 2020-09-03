const { validateUser } = require("../src/network/common")

// test validUser -----------
it('InvalidName: empty', () => {
    const expected = false
    const input = {
        name: ''
    }
    expect(validateUser(input)).toEqual(expected)
})

it('InvalidName: null', () => {
    const expected = false
    const input = {
        name: null
    }
    expect(validateUser(input)).toEqual(expected)
})

it('InvalidName: length < 2', () => {
    const expected = false
    const input = {
        name: 'a'
    }
    expect(validateUser(input)).toEqual(expected)
})

it('InvalidName: length > 15', () => {
    const expected = false
    const input = {
        name: 'test test test test'
    }
    expect(validateUser(input)).toEqual(expected)
})

it('InvalidPhone: length > 10', () => {
    const expected = false
    const input = {
        name: 'Vanh Trinh',
        phone: '012345678900'
    }
    expect(validateUser(input)).toEqual(expected)
})

it('InvalidPhone: length > 10', () => {
    const expected = false
    const input = {
        name: 'Vanh Trinh',
        phone: 'dddddddddddddddddd'
    }
    expect(validateUser(input)).toEqual(expected)
})

it('validPhone: ', () => {
    const expected = true
    const input = {
        name: 'Vanh Trinh',
        phone: '0123456789'
    }
    expect(validateUser(input)).toEqual(expected)
})

it('validUser: ', () => {
    const expected = true
    const input = {
        name: 'Vanh Trinh',
        phone: '0123456789'
    }
    expect(validateUser(input)).toEqual(expected)
})


