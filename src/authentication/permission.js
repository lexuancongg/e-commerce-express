exports.permissionMiddleware = function permissionMiddleware(req, res, next) {
    if (!req.user.isSupperAdmin || req.user.role !== "admin") {
        switch (req.originalUrl) {
            case '/product/create': {
                console.log('banj khoong du quyen hanj')
            }
        }
    }
}