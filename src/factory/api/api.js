export default function (id) {
    return new Promise(res => {
        res({ id, title: id + 'somebody' })
    })
}