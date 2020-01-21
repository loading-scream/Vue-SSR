export default function (id) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(id + 'somebody')
        }, 1000);
    })
}