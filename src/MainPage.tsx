import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { DialogFooter, DialogHeader } from "./components/ui/dialog";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./components/ui/select";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import axios from 'axios';
//@ts-ignore
import toastr from "toastr";


const MainPage = () => {
    const navigate = useNavigate();
    interface MasterFormState {
        email: string;
        accnum: string;
        password: string;
        server: string;
        isLive: string;
    }

    interface SlaveFormState {
        email: string;
        accnum: string;
        password: string;
        server: string;
        isLive: string;
        isConnected: boolean;
    }

    const [slaves, setSlaves] = useState<SlaveFormState[]>([]);

    const [openSlave, setOpenSlave] = React.useState(false);
    const [openMaster, setOpenMaster] = React.useState(false);

    const [masterFormState, setMasterFormState] = React.useState<MasterFormState>({
        email: '',
        accnum: '',
        password: '',
        server: '',
        isLive: ''
    });

    const [slaveFormState, setSlaveFormState] = React.useState<SlaveFormState>({
        email: '',
        accnum: '',
        password: '',
        server: '',
        isLive: '',
        isConnected: false,
    });

    const gotoFirstPage = () => {
        navigate("/");
    }

    const saveMaster = () => {
        setOpenMaster(false);

    }

    const saveSlave = () => {
        setOpenSlave(false);
        setSlaves((prev) => ([
            ...prev,
            slaveFormState
        ]))
        setSlaveFormState({
            email: '',
            accnum: '',
            password: '',
            server: '',
            isLive: '',
            isConnected: false,
        })
    }

    const handleSlaveConnect = async (rowId: number) => {
        const selectedSlave = slaves.filter((_slave: SlaveFormState, index: number) => index === rowId)
        var resp = await axios.post("http://localhost:8080/data", {
            master: masterFormState, slave: selectedSlave
        });
        if (resp.data === "success") {
            const newSlaves = slaves.map((slave) => {
                if (slave.email === selectedSlave[0].email) {
                    return {
                        ...slave,
                        isConnected: true
                    }
                }
                return slave
            })
            setSlaves(newSlaves)
            toastr.success("Connected")
        }
    }
    
    const fetch = async () => {
        console.log("STATUS REQUEST")
        try {
            const response = await axios.get("http://localhost:8080/status");
            if (response.data != "Position") toastr.success(response.data)
        } catch (error) {
            console.error(error); // Handle any errors
        }
    }

    useEffect(()=>{
        const statusInterval = setInterval(() => {
            fetch();
        }, 5000);
        return function stopTimer() {
            clearInterval(statusInterval);
          }
    }, [])
    


    const handleDelete = (selectedIndex: number) => {
        setSlaves(slaves.filter((_slave: MasterFormState, index: number) => index !== selectedIndex));
        console.log(slaves[0].email);
        axios.post("http://localhost:8080/deleteSlave", slaves[0].email).then(() => {
            toastr.warning("Slave Account Deleted");
        });
    }

    const masterDelete = () => {
        setMasterFormState({
            email: '',
            accnum: '',
            password: '',
            server: '',
            isLive: ''
        })
        toastr.warning("Master Account Deleted");
    }

    return (
        <div className="flex flex-col w-[100%] min-h-[100%] bg-[rgb(19,20,21)]">
            <div className="flex flex-col pt-12 pl-12  font-bold w-fit place-items-center cursor-pointer" onClick={gotoFirstPage}>
                <div className="text-white text-xl">TRADELOCKER</div>
                <div className="text-slate-400 text-lg">COPIER</div>
            </div>
            <div>
                <div className="flex flex-row  pt-32 pl-24 items-end">
                    <div className="text-white text-2xl">Master</div>
                    <div className="ml-5">
                        <Dialog open={openMaster} onOpenChange={setOpenMaster}>
                            <DialogTrigger asChild>
                                <Button onClick={() => setOpenMaster(true)} variant="secondary" className="w-15 h-7 rounded border-transparent  bg-[rgb(22,148,212)] rounded-md">Add</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[475px]" >
                                <DialogHeader>
                                    <DialogTitle>Add Account</DialogTitle>
                                    <DialogDescription>
                                        This is the Master Account
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Email</Label>
                                        <Input id="email" value={masterFormState.email} autoFocus onChange={(e) => setMasterFormState({ ...masterFormState, email: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Account Number</Label>
                                        <Input id="accnum" value={masterFormState.accnum} autoFocus onChange={(e) => setMasterFormState({ ...masterFormState, accnum: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Password</Label>
                                        <Input id="pwd" value={masterFormState.password} autoFocus onChange={(e) => setMasterFormState({ ...masterFormState, password: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Server</Label>
                                        <Input id="server" value={masterFormState.server} autoFocus onChange={(e) => setMasterFormState({ ...masterFormState, server: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Server Type</Label>
                                        <Select onValueChange={(value) => setMasterFormState({ ...masterFormState, isLive: value })}>
                                            <SelectTrigger className="w-[425px]">
                                                <SelectValue placeholder="Select a Server Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Server Type</SelectLabel>
                                                    <SelectItem value="Live">Live</SelectItem>
                                                    <SelectItem value="Demo">Demo</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={saveMaster}>Save</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <Table className="w-[70%] border-white">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px] text-white">Email</TableHead>
                            <TableHead className="text-white">Account Number</TableHead>
                            <TableHead className="text-white">Server</TableHead>
                            <TableHead className="text-right text-white">Server Type</TableHead>
                            <TableHead className="text-right text-white">Connection</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium text-white">{masterFormState.email}</TableCell>
                            <TableCell className="font-medium text-white">{masterFormState.accnum}</TableCell>
                            <TableCell className="font-medium text-white">{masterFormState.server}</TableCell>
                            <TableCell className="text-right text-white">{masterFormState.isLive}</TableCell>
                            <TableCell className="text-right text-white">
                                <div className="flex justify-end gap-6">
                                    <img src='../src/assets/Delete.svg' className="w-7 cursor-pointer" onClick={masterDelete}></img>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <div>
                <div className="flex flex-row  pt-12 pl-24 items-end">
                    <div className="text-white text-2xl">Slave</div>
                    <div className="ml-5">
                        <Dialog open={openSlave} onOpenChange={setOpenSlave}>
                            <DialogTrigger asChild>
                                <Button onClick={() => setOpenSlave(true)} variant="secondary" className="w-15 h-7 rounded border-transparent  bg-[rgb(22,148,212)] rounded-md">Add</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[475px]" >
                                <DialogHeader>
                                    <DialogTitle>Add Account</DialogTitle>
                                    <DialogDescription>
                                        This is the Slave Account
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Email</Label>
                                        <Input id="email" value={slaveFormState.email} autoFocus onChange={(e) => setSlaveFormState({ ...slaveFormState, email: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Account Number</Label>
                                        <Input id="accnum" value={slaveFormState.accnum} autoFocus onChange={(e) => setSlaveFormState({ ...slaveFormState, accnum: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Password</Label>
                                        <Input id="pwd" value={slaveFormState.password} autoFocus onChange={(e) => setSlaveFormState({ ...slaveFormState, password: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Server</Label>
                                        <Input id="server" value={slaveFormState.server} autoFocus onChange={(e) => setSlaveFormState({ ...slaveFormState, server: e.target.value })} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Server Type</Label>
                                        <Select onValueChange={(value) => setSlaveFormState({ ...slaveFormState, isLive: value })}>
                                            <SelectTrigger className="w-[425px]">
                                                <SelectValue placeholder="Select a Server Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Server Type</SelectLabel>
                                                    <SelectItem value="Live">Live</SelectItem>
                                                    <SelectItem value="Demo">Demo</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={saveSlave}>Save</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <Table className="w-[70%] border-white">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px] text-white">Email</TableHead>
                            <TableHead className="text-white">Account Number</TableHead>
                            <TableHead className="text-white">Server</TableHead>
                            <TableHead className="text-right text-white">Server Type</TableHead>
                            <TableHead className="text-right text-white">Status</TableHead>
                            <TableHead className="text-right text-white">Connection</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            slaves.map((slave, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium text-white">{slave.email}</TableCell>
                                    <TableCell className="font-medium text-white">{slave.accnum}</TableCell>
                                    <TableCell className="font-medium text-white">{slave.server}</TableCell>
                                    <TableCell className="text-right text-white">{slave.isLive}</TableCell>
                                    <TableCell className="text-right text-white">{slave.isConnected ? "Connected" : "No Connection"}</TableCell>
                                    <TableCell className="text-right text-white">
                                        <div className="flex justify-end gap-6">
                                            <img src='../src/assets/Connection.svg' className="w-7 cursor-pointer" onClick={() => handleSlaveConnect(index)}></img>
                                            <img src='../src/assets/Delete.svg' className="w-7 cursor-pointer" onClick={() => handleDelete(index)}></img>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default MainPage