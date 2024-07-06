import {GuildMember} from "discord.js";

export enum ValueEvolution {
    PASS,
    FAIL,
    BEST,
    MILESTONE
}

class Counter {
    public value = 0
    public best = 0
    public lastValue = 0
    public lastUser = ''
    public fails = new Map<string, number>

    increment(nb: number, user: GuildMember) {
        if (nb !== (this.value + 1) || user.id === this.lastUser) {
            if (this.value > this.best)
                this.best = this.value
            this.lastValue = this.value
            this.value = 0
            this.lastUser = ''
            if (this.fails.has(user.id))
                this.fails.set(user.id, 0)
            else
                this.fails.set(user.id, this.fails.get(user.id)!)
            return ValueEvolution.FAIL
        }
        this.value += 1
        this.lastUser = user.id
        if (this.value > this.best) {
            this.best = this.value
            return ValueEvolution.BEST
        }
        return this.value % 100 === 0 ? ValueEvolution.MILESTONE : ValueEvolution.PASS
    }

    setValue(value: number) {
        if (value < 0) return
        this.value = value
        this.lastUser = ''
    }

    reset() {
        this.setValue(0)
    }

    getFailMessage() {
        let response = ''
        if (this.fails.size === 0)
            return "Fortunately, nobody failed... For now."
        this.fails.forEach((v, k) => {
            response += `<@${k}> : ${v}\n`
        })
        return response
    }

    resurrect() {
        this.setValue(this.lastValue)
    }
}

export const counter = new Counter()