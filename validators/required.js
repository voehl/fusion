export default value =>
    ((value !== null && value !== undefined && value !== '') ? undefined : 'Required');