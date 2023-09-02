class Counter:
    def __init__(self):
        self.value = 0
        self.record = 0
        self.lnb = 0
        self.luser = 0
        self.fails = {}

    def increment(self, nb, user):
        assert nb > 0
        if nb != self.value + 1 or user.id == self.luser:
            self.lnb = self.value
            self.record = self.value
            self.value = 0
            self.luser = 0
            if str(user.id) not in self.fails.keys():
                self.fails[str(user.id)] = 1
            else:
                self.fails[str(user.id)] += 1
            return -1
        self.value += 1
        self.luser = user.id
        if self.value > self.record:
            self.record = self.value
            return 1
        return 0

    def setValue(self, nb):
        assert nb >= 0
        self.value = nb
        self.luser = 0

    def reset(self):
        self.value = 0
        self.luser = 0

    def getValue(self):
        return self.value

    def getRecord(self):
        return self.record

    def getLastUser(self):
        return self.luser

    def getLastNumber(self):
        return self.lnb

    def getFails(self):
        return self.fails

    def getFailsStr(self):
        resp = ""
        if len(self.fails.keys()) == 0:
            return 1
        for e in self.fails.keys():
            resp += f"<@{e}> : {self.fails[e]}\n"
        return resp
