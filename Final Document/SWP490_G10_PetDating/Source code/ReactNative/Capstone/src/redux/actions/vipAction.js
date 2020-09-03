import { SAVE_VIP } from "./types"

export const saveVip = (vip) => ({
    type: SAVE_VIP,
    vip: vip
})
