export default function (id) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res({ id, title: id + 'somebody' })
        }, 50);
    })
}