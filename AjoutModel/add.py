from fileinput import filename
import json
from pydoc import describe
import sys
from tkinter import filedialog as fd
from tkinter import ttk
import tkinter as tk
from unicodedata import name

def modelSelect():
    filename = fd.askopenfilename(title='Choississez un fichier',
                                  initialdir='/',
                                  filetypes = [("model files", "*.glb *.gltf *.obj")])
    l1.config(text=filename)

def writeToJson():
    file = l1.cget("text")
    name = e1.get()
    description = e2.get()
    size = e3.get()
    dict = { 
        "path" : file,
        "name" : name,
        "description" : description,
        "size" : size
    }   
    print(dict)
    
    
    if(file != 'Please choose a file' and file and name and description and float(size)):
        with open('../modelList.json', 'a') as json_file:
            json.dump(dict, json_file)
            json_file.flush()
            json_file.close()
        l2.config(text= "Succes !")
    else:
        print(size.isdigit())
        l2.config(text= "ERREUR VEUILLEZ REESAYER")

main = tk.Tk()
main.title('Ajout de modèle')
main.resizable(False, False)
main.geometry('600x200')

tk.Label(main, text="Nom du modèle").grid(row=0)
tk.Label(main, text="Description").grid(row=1)
tk.Label(main, text="Taille du modèle (en m)").grid(row=2)
l1 = tk.Label(main, text='Please choose a file')
l1.grid(row=3)

l2 = tk.Label(main, text='')
l2.grid(row=6)

name = ""
description= ""
size= ""
filename = ""
e1 = tk.Entry(main, textvariable=name)
e2 = tk.Entry(main, textvariable=description)
e3 = tk.Entry(main, textvariable=size)

e1.grid(row=0, column=1)
e2.grid(row=1, column=1)
e3.grid(row=2, column=1)


file = None

            

openBtn = ttk.Button(main, text='Ouvrir un fichier', command=modelSelect)    
openBtn.grid(row=3, column=1)

acceptBtn = ttk.Button(main, text='Confirmer', command=writeToJson)    
acceptBtn.grid(row=4, column=0)

quitBtn = ttk.Button(main, text='Quitter', command=main.destroy)    
quitBtn.grid(row=4, column=1)

main.mainloop()