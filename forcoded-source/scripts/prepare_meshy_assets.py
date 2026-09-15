import bpy,sys,json,math
from pathlib import Path
from mathutils import Vector
root=Path(__file__).resolve().parents[1]
stats=[]
for name in ['robot','chair']:
 bpy.ops.wm.read_factory_settings(use_empty=True)
 bpy.ops.import_scene.gltf(filepath=str(root/'asset-sources'/f'{name}-original.glb'))
 meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
 bpy.ops.object.select_all(action='DESELECT')
 for o in meshes:o.select_set(True)
 bpy.context.view_layer.objects.active=meshes[0]
 bpy.ops.object.join();o=bpy.context.object;o.name=f'CODED_{name}'
 bpy.ops.object.transform_apply(location=False,rotation=True,scale=True)
 pts=[o.matrix_world@Vector(v) for v in o.bound_box];mn=Vector(tuple(min(v[i] for v in pts) for i in range(3)));mx=Vector(tuple(max(v[i] for v in pts) for i in range(3)))
 scale=1/(mx.z-mn.z);center=(mn+mx)/2
 for v in o.data.vertices:v.co=(v.co-Vector((center.x,center.y,mn.z)))*scale
 o.location=(0,0,0)
 bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.mesh.remove_doubles(threshold=.00001);bpy.ops.mesh.normals_make_consistent(inside=False);bpy.ops.object.mode_set(mode='OBJECT')
 for poly in o.data.polygons:poly.use_smooth=True
 for image in bpy.data.images:
  if image.size[0]>1024:image.scale(1024,1024)
 bpy.ops.wm.save_as_mainfile(filepath=str(root/'asset-sources'/'processed'/f'{name}.blend'))
 for tier,ratio,tex in [('desktop',1,1024),('mobile',.42,512)]:
  if ratio<1:
   mod=o.modifiers.new('Mobile silhouette-preserving reduction','DECIMATE');mod.ratio=ratio;bpy.ops.object.modifier_apply(modifier=mod.name)
   for image in bpy.data.images:
    if image.size[0]>tex:image.scale(tex,tex)
  path=root/'public'/'models'/f'{name}-{tier}.glb'
  bpy.ops.export_scene.gltf(filepath=str(path),export_format='GLB',use_selection=True,export_image_format='JPEG',export_jpeg_quality=85,export_draco_mesh_compression_enable=False)
  tris=sum(len(p.vertices)-2 for p in o.data.polygons)
  stats.append({'asset':name,'tier':tier,'triangles':tris,'textureMax':tex,'bytes':path.stat().st_size})
 # Inspect normalized model under simple product lighting.
 scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=16
 scene.world=bpy.data.worlds.new('Studio');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.7,.7,.7,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.5
 for loc,power,size in [((3,-4,5),450,4),((-3,-1,2),200,3),((0,3,4),300,3)]:
  bpy.ops.object.light_add(type='AREA',location=loc);light=bpy.context.object;light.data.energy=power;light.data.shape='DISK';light.data.size=size;light.rotation_euler=(Vector((0,0,.5))-light.location).to_track_quat('-Z','Y').to_euler()
 bpy.ops.object.camera_add(location=(1.8,-2.8,1.6));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,.5))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=1.7;scene.camera=cam
 scene.render.resolution_x=512;scene.render.resolution_y=512;scene.render.resolution_percentage=100;scene.render.film_transparent=True;scene.render.filepath=str(root/'previews'/f'{name}-asset.png');bpy.ops.render.render(write_still=True)
(root/'asset-sources'/'model-stats.json').write_text(json.dumps(stats,indent=2))
