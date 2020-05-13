using Microsoft.Azure.Kinect.BodyTracking;
using Microsoft.Azure.Kinect.Sensor;
using System;
using System.Diagnostics;
using Confluent.Kafka;
using System.Threading.Tasks;

using System;
using System.Net;
using System.Net.Sockets;
using System.Text;

namespace Csharp_3d_viewer
{
	class Program
	{
		static void Main()
		{
			azureKinect();
		}

		public static void azureKinect()
		{
			//using (var visualizerData = new VisualizerData())
			//{
			//var renderer = new Renderer(visualizerData);

			//renderer.StartVisualizationThread();

			Debug.WriteLine("start main");
				using (Device device = Device.Open())
				{
					Debug.WriteLine("opened device");
					device.StartCameras(new DeviceConfiguration()
					{
						CameraFPS = FPS.FPS30,
						ColorResolution = ColorResolution.Off,
						DepthMode = DepthMode.NFOV_Unbinned,
						WiredSyncMode = WiredSyncMode.Standalone,
					});

					Debug.WriteLine("started camera");
					var deviceCalibration = device.GetCalibration();

					//small difference with PointCloud enabled
					//pos: head -0.2916188 -178.0469 853.1077
					//pos: head -5.753897 -183.444 856.1947
					PointCloud.ComputePointCloudCache(deviceCalibration);

					using (Tracker tracker = Tracker.Create(deviceCalibration, new TrackerConfiguration() { ProcessingMode = TrackerProcessingMode.Gpu, SensorOrientation = SensorOrientation.Default }))
					{
						Debug.WriteLine("tracker created");
						string filepath = "D:\\Repos\\PersonalGithub\\csharp_3d_viewer\\captured-data\\WriteLines2.txt";
						System.IO.StreamWriter file = new System.IO.StreamWriter(filepath, true);
						//while (renderer.IsActive)
					while (true)
						{
							using (Capture sensorCapture = device.GetCapture())
							{
								// Queue latest frame from the sensor.
								tracker.EnqueueCapture(sensorCapture);
							}

							Debug.WriteLine("while");
							using (Frame frame = tracker.PopResult(TimeSpan.FromMilliseconds(500), throwOnTimeout: false))
							{
								Debug.WriteLine("popped result");
								if (frame != null)
								{
									Debug.WriteLine("{0} bodies found.", frame.NumberOfBodies);
									//visualizerData.Frame = frame.Reference();

									if (frame.NumberOfBodies > 0)
									{
									Debug.WriteLine("body id: " + frame.GetBodyId(0));
									Skeleton skeleton = frame.GetBodySkeleton(0);
									//Joint head = skeleton.GetJoint(JointId.Head);
									//string msg = "pos: head " + head.Position.X + " " + head.Position.Y + " " + head.Position.Z + " " + head.Quaternion.W + " " + head.Quaternion.X + " " + head.Quaternion.Y +  " " + head.Quaternion.Z;
									//Debug.WriteLine(msg);
									//produce(msg);

									string stringifiedSkeleton = "";

										for (var i = 0; i < (int)JointId.Count; i++)
										{
										Joint joint = skeleton.GetJoint(i);
										float posX = joint.Position.X;
										float posY = joint.Position.Y;
										float posZ = joint.Position.Z;

										float quatW = joint.Quaternion.W;
										float quatX = joint.Quaternion.X;
										float quatY = joint.Quaternion.Y;
										float quatZ = joint.Quaternion.Z;

										JointId jointName = (JointId)i;
										//string stringifiedJoint = String.Format("{0}#{1}#{2}#{3}#{4}#{5}{6}#{7}", jointName, posX, posY, posZ, quatW, quatX, quatY, quatZ); // 8 components -000 = 32 + 7 = 39
										string stringifiedJoint = String.Format("{0}#{1}#{2}#{3}#{4}#{5}#{6}", posX, posY, posZ, quatW, quatX, quatY, quatZ); // 7 components -000 = 28 + 5 = 33

										stringifiedSkeleton = String.Format("{0}@{1}", stringifiedSkeleton, stringifiedJoint); // 32*7=224 32*8=256 components, 224*33=7392 256*39=9984
										}

									stringifiedSkeleton = String.Format("{0}!{1}", DateTime.UtcNow.ToString(), stringifiedSkeleton); // x5/x6/2005 09:34:42 PM = 22 char + 2, 7418 vs 10,008 chars passed for every skeleton

									Debug.WriteLine(stringifiedSkeleton);
									file.WriteLine(stringifiedSkeleton);
									//produce(stringifiedSkeleton);
								}
							}
						}
					}
				}
			}
		}

		public static async Task produce(string message)
		{
			Console.WriteLine("produce ");
			var config = new ProducerConfig { BootstrapServers = "localhost:9092" };

			// If serializers are not specified, default serializers from
			// `Confluent.Kafka.Serializers` will be automatically used where
			// available. Note: by default strings are encoded as UTF8.
			using (var p = new ProducerBuilder<Null, string>(config).Build())
			{
				Console.WriteLine("using");
				try
				{
					Console.WriteLine("try");
					var dr = await p.ProduceAsync("testTopicName", new Message<Null, string> { Value = message }).ConfigureAwait(false);
					Console.WriteLine($"Delivered '{dr.Value}' to '{dr.TopicPartitionOffset}'");
				}
				catch (ProduceException<Null, string> e)
				{
					Console.WriteLine("catch");
					Console.WriteLine($"Delivery failed: {e.Error.Reason}");
				}
				Console.WriteLine("did try");
			}
		}
	}
}